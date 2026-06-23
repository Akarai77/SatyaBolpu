import {
  TbSortAscending2Filled,
  TbSortDescending2Filled,
} from 'react-icons/tb';

export type SortOptionsProps = {
  sortOptions: Record<string, string>;
  selectedSortOption: string;
  setSelectedSortOption: React.Dispatch<React.SetStateAction<string>>;
  order: 'asc' | 'desc';
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
};

const SortOptions = ({
  sortOptions,
  selectedSortOption,
  setSelectedSortOption,
  order,
  setOrder,
}: SortOptionsProps) => {
  return (
    <div className="flex p-2 gap-3 z-0 mx-auto flex-wrap">
      <div
        className="text-white/70 flex items-center justify-center text-[1.5rem] cursor-pointer
          hover:text-primary transition-colors duration-200"
      >
        {order === 'asc' ? (
          <TbSortAscending2Filled onClick={() => setOrder('desc')} />
        ) : (
          <TbSortDescending2Filled onClick={() => setOrder('asc')} />
        )}
      </div>
      {Object.entries(sortOptions).map((entry) => (
        <div
          key={entry[1]}
          className={`flex gap-1 items-center justify-center px-3 py-1 rounded-full text-xs font-semibold
            cursor-pointer transition-all duration-200 border
            ${
              selectedSortOption === entry[1]
                ? 'bg-primary text-black border-primary'
                : 'bg-primary/10 text-primary border-white/10 hover:bg-primary/20 hover:border-primary/30'
            }`}
          onClick={() => setSelectedSortOption(entry[1])}
        >
          {entry[0]}
        </div>
      ))}
    </div>
  );
};

export default SortOptions;
