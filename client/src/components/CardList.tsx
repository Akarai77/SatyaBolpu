import { BaseCardProps, CardListProps } from '../types/globals';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import useApi from '../hooks/useApi';
import { Option } from './DropDown';
import { FaSortAmountDown } from 'react-icons/fa';
import Filters from './Filters';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import SortOptions from './SortOptions';

const toCamelCase = (str: string) => {
  str = str.toLowerCase();
  return (
    str.split(' ')[0] +
    str
      .split(' ')
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  );
};

const buildEndpoint = (
  apiEndpoint: string,
  pagination: boolean,
  pageNo: string,
  cardsPerPage: number | undefined,
  selectFields: string | undefined,
) => {
  const params = new URLSearchParams();
  if (pagination && cardsPerPage) {
    params.set('page', pageNo);
    params.set('limit', cardsPerPage.toString());
  }
  if (selectFields) {
    const existing = new URLSearchParams(selectFields);
    existing.forEach((value, key) => params.set(key, value));
  }
  const qs = params.toString();
  return `/${apiEndpoint}${qs ? `?${qs}` : ''}`;
};

const buildFilterQueryString = (
  selectedFilters: Record<string, Option<string>[]>,
  selectedSortOption: string,
  order: 'asc' | 'desc',
) => {
  const params = new URLSearchParams();
  Object.entries(selectedFilters)
    .filter(([, values]) => values.length > 0)
    .forEach(([key, values]) => {
      params.set(`${toCamelCase(key)}s`, values.map((v) => v.value).join(','));
    });
  params.set('sortBy', selectedSortOption);
  params.set('orderBy', order);
  return params.toString();
};

const Pagination = ({
  pageNo,
  totalPages,
  handleArrows,
  handlePageChange,
}: {
  pageNo: string;
  totalPages: number;
  handleArrows: (action: '+' | '-') => void;
  handlePageChange: (val: string) => void;
}) => {
  const [inputPageNo, setInputPageNo] = useState(pageNo);
  const isPrevDisabled = Number(pageNo) <= 1;
  const isNextDisabled = Number(pageNo) >= totalPages;

  useEffect(() => {
    setInputPageNo(pageNo);
  }, [pageNo]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '-', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    if (!val) {
      setInputPageNo('');
      return;
    }
    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > totalPages) return;
    setInputPageNo(val);
  };

  const commitPageChange = () => {
    const num = parseInt(inputPageNo);
    if (!inputPageNo || isNaN(num) || num < 1 || num > totalPages) {
      setInputPageNo(pageNo);
    } else {
      handlePageChange(inputPageNo);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="text-[2rem] text-white flex items-center justify-center gap-3">
        <GrFormPrevious
          className={`bg-white/5 border border-white/10 py-2 rounded-2xl cursor-pointer transition-all duration-200
            ${
              isPrevDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-primary/30 hover:text-primary'
            }`}
          onClick={() => !isPrevDisabled && handleArrows('-')}
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            className="bg-white/5 border border-white/30 text-white text-[1.5rem] w-10 h-10 text-center rounded-full
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
              hover:border-primary/30 focus:border-primary focus:outline-none cursor-pointer transition-all duration-200"
            value={inputPageNo}
            onKeyDownCapture={handleKeyDown}
            onChange={handleInputPageChange}
            onBlur={commitPageChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
          />
          <span className="text-white/50 text-lg">/ {totalPages}</span>
        </div>
        <GrFormNext
          className={`bg-white/5 border border-white/10 py-2 rounded-2xl cursor-pointer transition-all duration-200
            ${
              isNextDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-primary/30 hover:text-primary'
            }`}
          onClick={() => !isNextDisabled && handleArrows('+')}
        />
      </div>
    </div>
  );
};

const PaginationSkeleton = () => (
  <div className="w-full flex items-center justify-center">
    <div className="text-[2rem] text-white flex items-center justify-center gap-3">
      <GrFormPrevious className="bg-white/10 w-8 h-8 py-2 rounded-2xl" />
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-white/10 animate-pulse rounded-full"></div>
        <span className="text-white/50 text-lg">/ ...</span>
      </div>
      <GrFormNext className="bg-white/10 w-8 h-8 py-2 rounded-2xl" />
    </div>
  </div>
);

const CardList = <T extends BaseCardProps>({
  Card,
  SkeletonCard,
  apiEndpoint,
  dataKey,
  selectFields,
  orientation,
  cardsPerPage,
  handleEdit,
  handleDelete,
  pagination = true,
  searchBar = true,
  filterGroups,
  sortOptions,
}: CardListProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [pageNo, setPageNo] = useState<string>('1');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Option<string>[]>
  >(JSON.parse(sessionStorage.getItem('filters') ?? '{}'));
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    sessionStorage.getItem('sortOption') ?? 'createdAt',
  );
  const [order, setOrder] = useState<'asc' | 'desc'>(
    (sessionStorage.getItem('orderBy') ?? 'desc') as 'asc' | 'desc',
  );

  const filtersRef = useRef<HTMLDivElement>(null);

  const endpoint = buildEndpoint(
    apiEndpoint,
    pagination,
    pageNo,
    cardsPerPage,
    selectFields,
  );
  const api = useApi(endpoint, { auto: false });

  useEffect(() => {
    if (!pageNo) return;
    api.refetch();
  }, [pageNo, apiEndpoint, endpoint]);

  const handleInternalDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
    handleDelete?.(id);
  };

  const toggleSortOptions = () => {
    if (showSortOptions) {
      setSelectedSortOption('createdAt');
    }
    setShowSortOptions(!showSortOptions);
  };

  const toggleFilters = () => {
    if (showFilters) {
      setSelectedFilters({});
    }
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    const fetchFilteredData = async () => {
      const filterQs = buildFilterQueryString(
        selectedFilters,
        selectedSortOption,
        order,
      );

      if (!filterQs) return;

      const sep = pagination || selectFields ? '&' : '?';
      await api.refetch({
        endpoint: `${endpoint}${sep}${filterQs}`,
        method: 'GET',
      });
    };

    if (Object.values(selectedFilters).some((f) => f.length > 0)) {
      sessionStorage.setItem('filters', JSON.stringify(selectedFilters));
    } else {
      sessionStorage.removeItem('filters');
    }

    fetchFilteredData();
  }, [selectedFilters, selectedSortOption, order, endpoint]);

  useEffect(() => {
    if (selectedSortOption === 'createdAt') {
      sessionStorage.removeItem('sortOption');
    } else {
      sessionStorage.setItem('sortOption', selectedSortOption);
    }
  }, [selectedSortOption]);

  useEffect(() => {
    if (order === 'asc') {
      sessionStorage.setItem('orderBy', 'asc');
    } else {
      sessionStorage.removeItem('orderBy');
    }
  }, [order]);

  useEffect(() => {
    if (api.data) {
      setData(
        api.data[dataKey].map((d: Omit<T, 'handleEdit' | 'handleDelete'>) => ({
          handleEdit,
          handleDelete: handleInternalDelete,
          ...d,
        })),
      );
    }
  }, [api.data]);

  const totalPages = api.data?.totalPages;

  const handlePageChange = (val: string) => {
    const num = parseInt(val);
    if (!val) {
      setPageNo('');
      return;
    }
    if (isNaN(num)) return;
    if (num < 1 || num > totalPages) {
      return;
    }
    setPageNo(num.toString());
  };

  const handleArrows = (action: '+' | '-') => {
    const num = parseInt(pageNo);
    if (isNaN(num)) return setPageNo('1');
    if (action === '-') {
      if (num - 1 < 1) return setPageNo('1');
      setPageNo((num - 1).toString());
    } else {
      if (num + 1 > totalPages) return setPageNo(totalPages.toString());
      setPageNo((num + 1).toString());
    }
  };

  const paginationEl =
    pagination &&
    (api.loading && data.length === 0 ? (
      <PaginationSkeleton />
    ) : (
      data.length > 0 && (
        <Pagination
          pageNo={pageNo}
          totalPages={totalPages}
          handleArrows={handleArrows}
          handlePageChange={handlePageChange}
        />
      )
    ));

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-2/3 flex items-center justify-between mx-auto">
        {searchBar && (
          <div className="w-2/3 flex items-center gap-2">
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/30 text-white placeholder-white/40 p-2
                focus:border-primary focus:outline-none transition-all duration-200"
              placeholder="Search..."
              type="text"
            />
          </div>
        )}

        <div className="flex gap-2 items-center">
          {filterGroups && (
            <div className="text-primary">
              {showFilters ? (
                <MdFilterAltOff
                  className="hover:scale-110 transition-all cursor-pointer"
                  size={'35px'}
                  onClick={toggleFilters}
                />
              ) : (
                <MdFilterAlt
                  className="hover:scale-110 transition-all cursor-pointer"
                  size={'35px'}
                  onClick={toggleFilters}
                />
              )}
            </div>
          )}
          <div className="text-primary cursor-pointer hover:scale-110 transition-all">
            {sortOptions && (
              <FaSortAmountDown size={'25px'} onClick={toggleSortOptions} />
            )}
          </div>
        </div>
      </div>

      {filterGroups && (
        <div
          className="w-2/3 mx-auto overflow-hidden transition-all flex flex-col"
          ref={filtersRef}
          style={{
            height: showFilters ? 'auto' : '0',
          }}
        >
          <div className="text-primary text-[1.25rem] text-left">Filters:</div>
          <Filters
            filterGroups={filterGroups}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            ref={filtersRef}
          />
        </div>
      )}

      {sortOptions && (
        <div
          className="w-2/3 mx-auto overflow-hidden transition-all flex flex-col"
          style={{
            height: showSortOptions ? 'auto' : '0',
          }}
        >
          <div className="text-primary text-[1.25rem] text-left">Sort:</div>
          <SortOptions
            sortOptions={sortOptions}
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            order={order}
            setOrder={setOrder}
          />
        </div>
      )}

      {paginationEl}

      <div
        className="w-full my-10 flex flex-wrap gap-10 items-center justify-center"
        style={{
          flexDirection: orientation,
        }}
      >
        {api.loading ? (
          Array.from({ length: pagination ? cardsPerPage! : data.length }).map(
            (_, id) => <SkeletonCard key={id} />,
          )
        ) : api.error ? (
          <p className="text-red-400 text-lg">
            Something went wrong. Please try again.
          </p>
        ) : data.length > 0 ? (
          data.map((cardProps) => <Card {...cardProps} key={cardProps.id} />)
        ) : (
          <p className="text-white/40 text-lg">No Data available</p>
        )}
      </div>

      {paginationEl}
    </div>
  );
};

export default CardList;
