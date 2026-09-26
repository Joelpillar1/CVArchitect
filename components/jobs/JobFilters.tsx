import React, { useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Bookmark,
  RotateCcw
} from 'lucide-react';
import { JobFilterState } from '../../types/job';
import { CustomSelect, SelectOption } from './CustomSelect';

interface JobFiltersProps {
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
  onResetFilters: () => void;
  savedCount: number;
  totalJobsCount: number;
  filteredCount: number;
  availableCompanies?: string[];
}

const DEPARTMENTS: SelectOption[] = [
  { label: 'All Departments', value: 'all' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'AI & Data', value: 'AI & Data' },
  { label: 'Design & UX', value: 'Design & UX' },
  { label: 'Product', value: 'Product' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Sales & Growth', value: 'Sales & Growth' },
  { label: 'Finance', value: 'Finance' },
  // Real postings (legal, teaching, facilities) match no bucket, and forcing them into one
  // would misreport what the role is. They are grouped here instead.
  { label: 'Other', value: 'Other' },
];

const WORKPLACE_TYPES: SelectOption[] = [
  { label: 'All Workplace', value: 'all' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'On-site', value: 'On-site' },
];

const JOB_TYPES: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Part-time', value: 'Part-time' },
  { label: 'Contract', value: 'Contract' },
  { label: 'Internship', value: 'Internship' },
];

const EXPERIENCE_LEVELS: SelectOption[] = [
  { label: 'All Experience', value: 'all' },
  { label: 'Entry Level', value: 'Entry Level' },
  { label: 'Mid Level', value: 'Mid Level' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Lead / Staff', value: 'Lead / Staff' },
  { label: 'Executive', value: 'Executive' },
];

const SALARY_PRESETS: SelectOption<number>[] = [
  { label: 'Any Salary', value: 0 },
  { label: '$80k+', value: 80000 },
  { label: '$120k+', value: 120000 },
  { label: '$150k+', value: 150000 },
  { label: '$180k+', value: 180000 },
];

const SORT_OPTIONS: SelectOption<JobFilterState['sortBy']>[] = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Best Match', value: 'match_score' },
  { label: 'Highest Salary', value: 'salary_high' },
  { label: 'Featured', value: 'featured' },
];

export default function JobFilters({
  filters,
  onFilterChange,
  onResetFilters,
  savedCount,
  totalJobsCount,
  filteredCount,
  availableCompanies = [],
}: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const companyOptions: SelectOption[] = useMemo(() => [
    { label: 'All Companies', value: 'all' },
    ...availableCompanies.map((c) => ({ label: c, value: c })),
  ], [availableCompanies]);

  const hasActiveFilters = 
    filters.search.trim() !== '' ||
    (Boolean(filters.company) && filters.company !== 'all') ||
    filters.workplaceType !== 'all' ||
    filters.jobType !== 'all' ||
    filters.experienceLevel !== 'all' ||
    filters.department !== 'all' ||
    filters.minSalary > 0 ||
    filters.onlySaved;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleClearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 mb-6 space-y-4">
      {/* Top Search & Primary Filter Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by job title, skill (e.g. React, Python), or company..."
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
          {filters.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Company Filter Dropdown */}
          <CustomSelect
            value={filters.company || 'all'}
            onChange={(val) => onFilterChange({ ...filters, company: String(val) })}
            options={companyOptions}
            searchable={true}
            searchPlaceholder="Search company..."
            popoverClassName="w-56"
          />

          {/* Saved Jobs Toggle Button */}
          <button
            onClick={() => onFilterChange({ ...filters, onlySaved: !filters.onlySaved })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
              filters.onlySaved
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved ({savedCount})</span>
          </button>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
              showAdvanced || hasActiveFilters
                ? 'bg-gray-100 text-gray-900 border-gray-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <CustomSelect
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ ...filters, sortBy: val as JobFilterState['sortBy'] })}
            options={SORT_OPTIONS}
            popoverClassName="w-44"
          />
        </div>
      </div>

      {/* Quick Filter Chips (No Emojis) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100 text-xs">
        <span className="text-gray-400 font-medium mr-1">Quick filters:</span>

        <button
          onClick={() => onFilterChange({
            ...filters,
            workplaceType: filters.workplaceType === 'Remote' ? 'all' : 'Remote'
          })}
          className={`px-2.5 py-1 rounded border transition-colors ${
            filters.workplaceType === 'Remote'
              ? 'bg-gray-900 text-white border-gray-900 font-medium'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          Remote
        </button>

        <button
          onClick={() => onFilterChange({
            ...filters,
            minSalary: filters.minSalary === 150000 ? 0 : 150000
          })}
          className={`px-2.5 py-1 rounded border transition-colors ${
            filters.minSalary === 150000
              ? 'bg-gray-900 text-white border-gray-900 font-medium'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          $150k+ Salary
        </button>

        <button
          onClick={() => onFilterChange({
            ...filters,
            department: filters.department === 'Engineering' ? 'all' : 'Engineering'
          })}
          className={`px-2.5 py-1 rounded border transition-colors ${
            filters.department === 'Engineering'
              ? 'bg-gray-900 text-white border-gray-900 font-medium'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          Engineering
        </button>

        <button
          onClick={() => onFilterChange({
            ...filters,
            department: filters.department === 'AI & Data' ? 'all' : 'AI & Data'
          })}
          className={`px-2.5 py-1 rounded border transition-colors ${
            filters.department === 'AI & Data'
              ? 'bg-gray-900 text-white border-gray-900 font-medium'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          AI & Data
        </button>

        <button
          onClick={() => onFilterChange({
            ...filters,
            experienceLevel: filters.experienceLevel === 'Senior' ? 'all' : 'Senior'
          })}
          className={`px-2.5 py-1 rounded border transition-colors ${
            filters.experienceLevel === 'Senior'
              ? 'bg-gray-900 text-white border-gray-900 font-medium'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          Senior
        </button>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="ml-auto text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Expanded Filter Panel */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company
            </label>
            <CustomSelect
              value={filters.company || 'all'}
              onChange={(val) => onFilterChange({ ...filters, company: String(val) })}
              options={companyOptions}
              searchable={true}
              searchPlaceholder="Search company..."
              className="w-full"
              buttonClassName="w-full"
              popoverClassName="w-full min-w-[200px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Department
            </label>
            <CustomSelect
              value={filters.department}
              onChange={(val) => onFilterChange({ ...filters, department: String(val) })}
              options={DEPARTMENTS}
              className="w-full"
              buttonClassName="w-full"
              popoverClassName="w-full min-w-[180px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Workplace Type
            </label>
            <CustomSelect
              value={filters.workplaceType}
              onChange={(val) => onFilterChange({ ...filters, workplaceType: String(val) })}
              options={WORKPLACE_TYPES}
              className="w-full"
              buttonClassName="w-full"
              popoverClassName="w-full min-w-[180px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <CustomSelect
              value={filters.experienceLevel}
              onChange={(val) => onFilterChange({ ...filters, experienceLevel: String(val) })}
              options={EXPERIENCE_LEVELS}
              className="w-full"
              buttonClassName="w-full"
              popoverClassName="w-full min-w-[180px]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Salary
            </label>
            <CustomSelect
              value={filters.minSalary}
              onChange={(val) => onFilterChange({ ...filters, minSalary: Number(val) })}
              options={SALARY_PRESETS}
              className="w-full"
              buttonClassName="w-full"
              popoverClassName="w-full min-w-[180px]"
            />
          </div>
        </div>
      )}

      {/* Result summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
        <span>
          Showing <strong className="text-gray-900 font-semibold">{filteredCount}</strong> of {totalJobsCount} jobs
        </span>
      </div>
    </div>
  );
}
