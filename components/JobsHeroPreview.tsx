import React from 'react';
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
  CheckCircle,
  Sparkles,
  ArrowUp,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface JobCardData {
  id: string;
  company: string;
  verified: boolean;
  external: boolean;
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
    company: 'Hootsuite',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-[#D62828] text-white flex items-center justify-center text-xs font-bold">
        🦉
      </div>
    ),
    location: 'West Canada',
    title: 'Manager, Contract Operations',
    tags: ['Finance'],
    salary: 'Salary not disclosed',
    level: 'Lead / Staff',
    posted: 'Today',
  },
  {
    id: '2',
    company: 'Oyster',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
        O
      </div>
    ),
    location: 'Spain, Austria, Ireland, Portugal, Poland',
    title: 'Senior International HRBP',
    tags: ['Remote', 'Full-time', 'Operations'],
    salary: 'EUR44k - EUR275k/yr',
    level: 'Senior',
    posted: 'Today',
  },
  {
    id: '3',
    company: 'Corti',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-[#1E3A4C] text-white flex items-center justify-center text-[10px] font-bold">
        🫀
      </div>
    ),
    location: 'New York, USA, London, UK',
    title: 'Product Marketing Manager',
    tags: ['Full-time', 'Sales & Growth'],
    salary: 'Salary not disclosed',
    level: 'Lead / Staff',
    posted: 'Today',
  },
  {
    id: '4',
    company: 'Corti',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-[#1E3A4C] text-white flex items-center justify-center text-[10px] font-bold">
        🫀
      </div>
    ),
    location: 'Copenhagen, Denmark',
    title: 'GTM Engineer',
    tags: ['Full-time', 'Sales & Growth'],
    salary: 'Salary not disclosed',
    posted: 'Today',
  },
  {
    id: '5',
    company: 'Corti',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-[#1E3A4C] text-white flex items-center justify-center text-[10px] font-bold">
        🫀
      </div>
    ),
    location: 'Copenhagen, Denmark',
    title: 'Senior Backend Engineer, Audio Processing',
    tags: ['Full-time', 'Engineering'],
    salary: 'Salary not disclosed',
    level: 'Senior',
    posted: 'Today',
  },
  {
    id: '6',
    company: 'Corti',
    verified: true,
    external: true,
    logo: (
      <div className="w-6 h-6 rounded-full bg-[#1E3A4C] text-white flex items-center justify-center text-[10px] font-bold">
        🫀
      </div>
    ),
    location: 'Copenhagen, Denmark, Remote, US, Remote, Euro...',
    title: "Join Corti's Talent Community",
    tags: ['Remote', 'Full-time', 'Operations'],
    salary: 'Salary not disclosed',
    posted: 'Today',
  },
];

export default function JobsHeroPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenJobs = () => {
    navigate(user ? '/dashboard/jobs' : '/signup?redirect=/dashboard/jobs');
  };

  return (
    <div
      onClick={handleOpenJobs}
      className="w-full bg-[#fbfcfd] flex flex-col md:flex-row select-none text-[#242e3f] font-sans text-left transition-all group overflow-hidden cursor-pointer"
    >
      {/* Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200/80 p-4 flex-col justify-between shrink-0 min-h-[680px]">
        <div className="space-y-4">
          {/* Header with Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo icon.png"
                alt="CVArchitect Logo"
                className="w-7 h-7 rounded-lg object-contain shrink-0"
              />
              <span className="font-bold text-base text-gray-900 tracking-tight">
                CVArchitect
              </span>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Create New Resume Button */}
          <div className="pb-2">
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-green text-brand-dark font-bold text-xs tracking-wide uppercase rounded-xl shadow-xs cursor-pointer">
              <Plus size={16} className="stroke-[2.5] shrink-0" />
              <span>Create New Resume</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <Home size={18} className="text-gray-400" />
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-900 shadow-2xs">
              <Briefcase size={18} className="text-gray-900" />
              <span>Jobs</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <Layout size={18} className="text-gray-400" />
              <span>Templates</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <Bookmark size={18} className="text-gray-400" />
              <span>My Resumes</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <FileText size={18} className="text-gray-400" />
              <span>Cover Letters</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <BookOpen size={18} className="text-gray-400" />
              <span>Interview Prep</span>
            </div>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/70">
              <SettingsIcon size={18} className="text-gray-400" />
              <span>Settings</span>
            </div>
          </nav>
        </div>

        {/* Bottom Card with Plan Usage & Profile */}
        <div className="pt-3">
          {/* Usage & Plan Card */}
          <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-200/90 shadow-2xs select-none space-y-3">
            {/* Resumes Row */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
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
              <span className="text-[11px] font-bold tracking-wider text-brand-dark uppercase">
                APPLICATIONS
              </span>
              <span className="text-xs font-bold text-brand-dark">
                1 / 10
              </span>
            </div>

            {/* Upgrade Button */}
            <div className="w-full py-2 px-3 bg-brand-green hover:bg-brand-greenHover text-brand-dark text-xs font-extrabold tracking-wider uppercase rounded-xl flex items-center justify-center shadow-xs transition-all cursor-pointer">
              <span>UPGRADE</span>
            </div>

            {/* Profile Section Divider */}
            <div className="h-[1px] w-full bg-gray-200/80 pt-0.5" />

            {/* Profile Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1">
                <div className="w-8 h-8 rounded-full bg-brand-green/25 text-brand-dark border border-brand-green/40 flex items-center justify-center font-bold text-xs shrink-0">
                  JD
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-brand-dark truncate leading-tight">
                    John Doe
                  </div>
                  <div className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                    john.doe@example.com
                  </div>
                </div>
              </div>

              {/* Quick Sign Out */}
              <div className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer" title="Sign Out">
                <LogOut size={15} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Jobs Workspace */}
      <main className="flex-1 p-5 sm:p-7 space-y-4 overflow-hidden bg-[#fbfcfd]">
        {/* Top Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <div className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-gray-200/90 rounded-xl text-gray-400 shadow-2xs flex items-center">
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
        <div className="flex items-center gap-2 text-xs pt-0.5">
          <span className="text-gray-400 text-xs font-medium">Quick filters:</span>
          <div className="flex flex-wrap items-center gap-1.5">
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
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-900">60</span> of 8184 jobs
        </div>

        {/* 3x2 Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {JOBS_DATA.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Logo, Company, Verified, External, Bookmark */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="shrink-0 pt-0.5">{job.logo}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">{job.company}</span>
                        {job.verified && (
                          <span className="inline-block w-3.5 h-3.5 text-blue-500">
                            <CheckCircle size={14} className="fill-blue-500 text-white" />
                          </span>
                        )}
                        {job.external && (
                          <ExternalLink size={12} className="text-gray-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-8 h-8 rounded-xl border border-gray-200/90 flex items-center justify-center text-gray-400 hover:text-gray-700 shrink-0 bg-white">
                    <Bookmark size={14} />
                  </button>
                </div>

                {/* Job Title */}
                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 pt-1">
                  {job.title}
                </h4>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 bg-gray-100/90 text-gray-600 rounded-lg text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Salary Box */}
                <div className="px-3.5 py-2 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center justify-between text-xs font-medium text-gray-800">
                  <span>{job.salary}</span>
                  {job.level && (
                    <span className="text-[11px] text-gray-400">{job.level}</span>
                  )}
                </div>
              </div>

              {/* Card Footer: Time + Tailor Resume Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock size={12} />
                  {job.posted}
                </span>

                <button className="px-4 py-2 bg-[#242e3f] hover:bg-[#1a2230] text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
                  Tailor Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
