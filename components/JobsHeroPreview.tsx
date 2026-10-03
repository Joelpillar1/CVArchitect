import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Layout,
  Bookmark,
  FileText,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Clock,
  ExternalLink,
  BadgeCheck,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface JobCardData {
  id: string;
  company: string;
  logo: React.ReactNode;
  location: string;
  title: string;
  tags: string[];
  salary: string;
  level?: string;
  posted: string;
}

const JOBS_DATA: JobCardData[] = [
  {
    id: '1',
    company: 'DriveWealth',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-[#FFF7ED] border border-orange-200 text-[#EA580C] flex items-center justify-center text-xs font-black shrink-0">
        W
      </div>
    ),
    location: 'Office - Chicago',
    title: 'Program Manager',
    tags: ['Engineering'],
    salary: 'Salary not disclosed',
    level: 'Lead / Staff',
    posted: '1 day ago',
  },
  {
    id: '2',
    company: 'ClickHouse',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-black text-[#FACC15] flex items-center justify-center text-[11px] font-black shrink-0">
        |||
      </div>
    ),
    location: 'United States, Canada, United Kingdom, Germany, ...',
    title: 'Database Research Scientist',
    tags: ['Remote', 'Full-time', 'Engineering'],
    salary: '$175k - $235k/yr',
    posted: '1 day ago',
  },
  {
    id: '3',
    company: 'Speechmatics',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center text-xs font-black shrink-0">
        O
      </div>
    ),
    location: 'Cambridge, England, United Kingdom',
    title: 'Senior Machine Learning Engineer',
    tags: ['AI & Data'],
    salary: 'Salary not disclosed',
    level: 'Senior',
    posted: '1 day ago',
  },
  {
    id: '4',
    company: 'Speechmatics',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center text-xs font-black shrink-0">
        O
      </div>
    ),
    location: 'London, England, United Kingdom',
    title: 'Senior Machine Learning Engineer',
    tags: ['AI & Data'],
    salary: 'Salary not disclosed',
    level: 'Senior',
    posted: '1 day ago',
  },
  {
    id: '5',
    company: 'Cohere',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-[#102A27] text-[#D4A373] flex items-center justify-center text-[10px] font-bold shrink-0">
        🌿
      </div>
    ),
    location: 'Germany',
    title: 'Solutions Architect, Defence, DACH',
    tags: ['Remote', 'Full-time', 'Sales & Growth'],
    salary: 'Salary not disclosed',
    level: 'Senior',
    posted: '1 day ago',
  },
  {
    id: '6',
    company: 'Cohere',
    logo: (
      <div className="w-5.5 h-5.5 rounded-md bg-[#102A27] text-[#D4A373] flex items-center justify-center text-[10px] font-bold shrink-0">
        🌿
      </div>
    ),
    location: 'Germany',
    title: 'Solutions Architect - DACH',
    tags: ['Remote', 'Full-time', 'Sales & Growth'],
    salary: 'Salary not disclosed',
    level: 'Senior',
    posted: '1 day ago',
  },
];

const DESKTOP_BASE_WIDTH = 1728;
const DESKTOP_BASE_HEIGHT = 920;

export default function JobsHeroPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.8);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (!containerRef.current) return;
      const currentWidth = containerRef.current.clientWidth;
      if (currentWidth > 0) {
        setScale(currentWidth / DESKTOP_BASE_WIDTH);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleOpenJobs = () => {
    navigate(user ? '/dashboard/jobs' : '/signup?redirect=/dashboard/jobs');
  };

  return (
    <div
      ref={containerRef}
      onClick={handleOpenJobs}
      style={{ minHeight: `${DESKTOP_BASE_HEIGHT * scale}px`, height: `${DESKTOP_BASE_HEIGHT * scale}px` }}
      className="w-full bg-[#fbfcfd] flex flex-col md:flex-row select-none text-[#242e3f] font-sans text-left transition-all group overflow-hidden cursor-pointer"
    >
      {/* Left Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-gray-200/80 p-3.5 flex-col justify-between shrink-0 h-full">
        <div className="space-y-3.5">
          {/* Header with Logo */}
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo icon.png"
                alt="CVArchitect Logo"
                className="w-6 h-6 rounded-md object-contain shrink-0"
              />
              <span className="font-bold text-sm text-gray-900 tracking-tight">
                CVArchitect
              </span>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
              <ChevronLeft size={15} />
            </button>
          </div>

          {/* Create New Resume Button */}
          <div className="pb-1">
            <div className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-green text-brand-dark font-bold text-[11px] tracking-wide uppercase rounded-xl shadow-2xs cursor-pointer">
              <Plus size={14} className="stroke-[2.5] shrink-0" />
              <span>Create New Resume</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <Home size={16} className="text-gray-400" />
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-900 shadow-2xs">
              <Briefcase size={16} className="text-gray-900" />
              <span>Jobs</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <Layout size={16} className="text-gray-400" />
              <span>Templates</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <Bookmark size={16} className="text-gray-400" />
              <span>My Resumes</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <FileText size={16} className="text-gray-400" />
              <span>Cover Letters</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <BookOpen size={16} className="text-gray-400" />
              <span>Interview Prep</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100/70">
              <SettingsIcon size={16} className="text-gray-400" />
              <span>Settings</span>
            </div>
          </nav>
        </div>

        {/* Bottom Card with Plan Usage & Profile */}
        <div className="pt-2">
          {/* Usage & Plan Card */}
          <div className="rounded-xl bg-gray-50/80 p-3 border border-gray-200/90 shadow-2xs select-none space-y-2.5">
            {/* Resumes Row */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                RESUMES
              </span>
              <span className="text-xs font-semibold text-gray-700">
                3 / 1
              </span>
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-gray-200/80" />

            {/* Applications Row */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-[10px] font-bold tracking-wider text-brand-dark uppercase">
                APPLICATIONS
              </span>
              <span className="text-xs font-bold text-brand-dark">
                1 / 10
              </span>
            </div>

            {/* Upgrade Button */}
            <div className="w-full py-1.5 px-3 bg-brand-green hover:bg-brand-greenHover text-brand-dark text-[11px] font-extrabold tracking-wider uppercase rounded-lg flex items-center justify-center shadow-2xs transition-all cursor-pointer">
              <span>UPGRADE</span>
            </div>

            {/* Profile Section Divider */}
            <div className="h-[1px] w-full bg-gray-200/80 pt-0.5" />

            {/* Profile Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2 min-w-0 cursor-pointer flex-1">
                <div className="w-7 h-7 rounded-full bg-brand-green/25 text-brand-dark border border-brand-green/40 flex items-center justify-center font-bold text-[11px] shrink-0">
                  JD
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-brand-dark truncate leading-tight">
                    John Doe
                  </div>
                  <div className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                    john.doe@example.com
                  </div>
                </div>
              </div>

              {/* Quick Sign Out */}
              <div className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0 cursor-pointer" title="Sign Out">
                <LogOut size={14} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Jobs Workspace */}
      <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-3.5 overflow-hidden bg-[#fbfcfd] h-full flex flex-col justify-between">
        {/* Top 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* 1. Open Roles */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              OPEN ROLES
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              10,264
            </div>
          </div>

          {/* 2. Remote Positions */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              REMOTE POSITIONS
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              3,505
            </div>
          </div>

          {/* 3. Median Pay */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                MEDIAN PAY
              </span>
              <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                $181k
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-normal mt-0.5">
              11 of 60 disclose pay
            </span>
          </div>

          {/* 4. Saved Roles */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              SAVED ROLES
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              0
            </div>
          </div>
        </div>

        {/* Top Search & Filter White Card Box */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
          {/* Top Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <div className="w-full pl-10 pr-3.5 py-2.5 text-[13px] bg-white border border-gray-200/90 rounded-xl text-gray-400 shadow-2xs flex items-center truncate">
                Search by job title, skill (e.g. React, Python), or company...
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <div className="px-3.5 py-2 bg-white border border-gray-200/90 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>All Companies</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="px-3.5 py-2 bg-white border border-gray-200/90 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <Bookmark size={14} className="text-gray-400" />
                <span>Saved (0)</span>
              </div>
              <div className="px-3.5 py-2 bg-white border border-gray-200/90 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <SlidersHorizontal size={14} className="text-gray-400" />
                <span>Filters</span>
              </div>
              <div className="px-3.5 py-2 bg-white border border-gray-200/90 rounded-xl items-center gap-1.5 shadow-2xs hidden sm:flex">
                <span>Most Recent</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="flex items-center gap-2.5 text-xs pt-0.5">
            <span className="text-gray-400 text-xs font-medium">Quick filters:</span>
            <div className="flex flex-wrap items-center gap-2">
              {['Remote', '$150k+ Salary', 'Engineering', 'AI & Data', 'Senior'].map((filter, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-gray-200/90 text-gray-700 rounded-lg text-xs font-medium shadow-2xs hover:border-gray-400"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-xs text-gray-500 font-medium pt-0.5">
            Showing <span className="font-bold text-gray-900">60</span> of 10264 jobs
          </div>
        </div>

        {/* 3x2 Job Cards Grid — matching exact Dashboard JobCard layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-0.5">
          {JOBS_DATA.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-sm"
            >
              <div className="p-4 sm:p-5">
                {/* Header: Company, Location & Save Button */}
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.logo}
                      <span className="font-semibold text-neutral-900 text-sm truncate flex items-center gap-1">
                        {job.company}
                        <BadgeCheck size={14} className="text-[#3B82F6] fill-[#3B82F6] shrink-0" stroke="white" strokeWidth={2} />
                      </span>
                      <ExternalLink size={10} className="shrink-0 text-neutral-400" />
                    </div>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="shrink-0 text-neutral-400" />
                      <span className="truncate">{job.location}</span>
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-neutral-900 bg-white shrink-0"
                    title="Save job"
                    aria-label="Save bookmark"
                  >
                    <Bookmark size={14} />
                  </button>
                </div>

                {/* Job Title */}
                <h3 className="text-[15px] font-bold text-neutral-900 line-clamp-1 mb-2.5">
                  {job.title}
                </h3>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 min-h-[24px]">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-md border border-neutral-200/70 bg-neutral-50 text-neutral-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Salary Row */}
                <div className="flex items-center justify-between py-1.5 px-3 bg-neutral-50/80 rounded-xl border border-neutral-150 text-xs">
                  <span className="font-semibold text-neutral-900 truncate">
                    {job.salary}
                  </span>
                  {job.level && (
                    <span className="text-neutral-500 font-medium text-[11px] shrink-0 ml-2">
                      {job.level}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 sm:px-5 py-2.5 bg-neutral-50/40 border-t border-neutral-150 flex items-center justify-between gap-2 text-xs text-neutral-500">
                <div className="flex items-center gap-1 text-neutral-400 truncate">
                  <Clock size={12} className="shrink-0" />
                  <span className="truncate">{job.posted}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenJobs();
                  }}
                  className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-medium rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 shadow-2xs"
                >
                  <span>Tailor Resume</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
