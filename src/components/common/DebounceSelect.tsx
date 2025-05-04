import React, { useMemo, useRef, useState } from "react";
import { Select, Spin, Checkbox, Divider } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";

export interface DebounceSelectProps<
  OptionType extends {
    // 重命名 ValueType 为 OptionType
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
  ValuePropType = OptionType["value"] | OptionType["value"][] // 定义 Select 的 value prop 类型
> extends Omit<SelectProps<ValuePropType, OptionType>, "options" | "children"> {
  // 更新 SelectProps 泛型
  fetchOptions: (
    search: string,
    page: number
  ) => Promise<{
    data: OptionType[]; // 更新类型
    total: number;
  }>;
  debounceTimeout?: number;
  pageSize?: number;
  showSelectAll?: boolean; // 是否显示全选选项
  fetchAllOptions?: () => Promise<OptionType[]>; // 更新类型
}

/**
 * 带有防抖搜索和分页加载功能的Select组件
 */
function DebounceSelect<
  OptionType extends {
    // 更新泛型名称
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
  ValuePropType = OptionType["value"] | OptionType["value"][] // 添加 ValuePropType
>({
  fetchOptions,
  debounceTimeout = 300,
  pageSize = 10,
  showSelectAll = false,
  fetchAllOptions,
  ...props
}: DebounceSelectProps<OptionType, ValuePropType>) {
  // 更新 props 类型
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]); // 更新 options 类型
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const fetchRef = useRef(0);

  const loadOptions = async (value: string, currentPage: number) => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;

    // 如果是第一页，清空选项并重置页码
    if (currentPage === 1) {
      setOptions([]);
      setPage(1);
    }

    // 如果已经在获取数据，不重复请求
    if (fetching) {
      return;
    }

    setFetching(true);

    try {
      const { data, total } = await fetchOptions(value, currentPage);

      if (fetchId !== fetchRef.current) {
        // 如果不是最新的请求，忽略结果
        setFetching(false);
        return;
      }

      if (currentPage === 1) {
        // 如果是第一页，直接设置选项
        setOptions(data);
      } else {
        // 如果不是第一页，追加选项，但避免重复
        setOptions((prevOptions) => {
          // 获取新数据的ID列表
          const newIds = new Set(data.map((item) => item.value));
          // 过滤掉已有的选项，避免重复
          const filteredPrevOptions = prevOptions.filter(
            (item) => !newIds.has(item.value)
          );
          return [...filteredPrevOptions, ...data];
        });
      }

      setTotal(total);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching options:", error);
      setFetching(false);
    }
  };

  const debounceFetcher = useMemo(() => {
    const loadData = (value: string) => {
      setPage(1);
      setSearchText(value);
      loadOptions(value, 1);
    };

    return debounce(loadData, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  // 处理下拉框打开事件，在打开时立即加载选项
  const handleDropdownVisibleChange = (open: boolean) => {
    if (open) {
      // 当下拉框打开时，重置页码并加载第一页数据
      setPage(1);
      setSearchText("");
      // 如果没有正在获取数据，则加载选项
      if (!fetching) {
        loadOptions("", 1);
      }
    }

    // 调用原始的onDropdownVisibleChange
    props.onDropdownVisibleChange?.(open);
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { target } = e;
    const div = target as HTMLDivElement;

    // 当滚动到底部时，加载更多数据
    if (
      div.scrollHeight - div.scrollTop < div.clientHeight + 100 &&
      !fetching &&
      options.length < total &&
      // 确保我们还有更多页可以加载
      options.length > 0
    ) {
      console.log("滚动加载更多数据", {
        currentPage: page,
        optionsLength: options.length,
        total,
        hasMore: options.length < total,
      });

      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(searchText, nextPage);
    }

    // 调用原始的onPopupScroll
    props.onPopupScroll?.(e);
  };

  // 处理全选
  const handleSelectAll = async () => {
    if (!props.onChange) {
      return;
    }

    // 获取当前选中的值（确保是数组）
    const currentValue = Array.isArray(props.value) ? props.value : [];

    // 如果当前已经全选，则清空选择
    if (currentValue.length === total && total > 0) {
      // 将空数组断言为 ValuePropType
      props.onChange([] as ValuePropType, []);
      return;
    }

    // 否则，获取所有选项并设置为已选中
    setSelectAllLoading(true);
    try {
      let allOptions: OptionType[] = []; // 更新 allOptions 类型

      if (fetchAllOptions) {
        // 如果提供了fetchAllOptions方法，直接使用
        allOptions = await fetchAllOptions();
      } else {
        // 否则，使用分页加载获取所有选项
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const { data, total } = await fetchOptions("", currentPage);
          allOptions.push(...data);

          // 使用pageSize判断是否还有更多数据
          if (data.length < pageSize || allOptions.length >= total) {
            hasMore = false;
          } else {
            currentPage++;
          }
        }
      }

      const allValues = allOptions.map((item) => item.value);
      // 将 allValues 断言为 ValuePropType
      props.onChange(allValues as ValuePropType, allOptions);
    } catch (error) {
      console.error("Error fetching all options:", error);
    } finally {
      setSelectAllLoading(false);
    }
  };

  // 自定义下拉菜单渲染
  const dropdownRender = (menu: React.ReactElement) => {
    // 将 menu 类型改为 React.ReactElement
    if (!showSelectAll) {
      return menu;
    }

    // 获取当前选中的值（确保是数组）
    const currentValue = Array.isArray(props.value) ? props.value : [];

    // 计算是否全选或部分选中
    const isAllSelected = total > 0 && currentValue.length === total;
    const isIndeterminate =
      currentValue.length > 0 && currentValue.length < total;

    return (
      <div>
        <div style={{ padding: "8px 12px" }}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
            disabled={selectAllLoading}
          >
            全选 ({total})
          </Checkbox>
          {selectAllLoading && <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
        <Divider style={{ margin: "4px 0" }} />
        {menu}
      </div>
    );
  };

  return (
    <Select<ValuePropType, OptionType> // 更新 Select 泛型
      filterOption={false}
      onSearch={debounceFetcher}
      onPopupScroll={handlePopupScroll}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      dropdownRender={dropdownRender}
      showSearch={true}
      loading={fetching}
      allowClear={true}
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect;
