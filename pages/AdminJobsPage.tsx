import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Filter, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  Building2, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { Job, Department } from '../types/job';
import { 
  fetchAdminJobs, 
  createAdminJob, 
  updateAdminJob, 
  deleteAdminJob, 
  toggleJobActiveStatus, 
  fetchAdminJobStats,
  AdminJobStats 
} from '../services/adminJobService';
import { formatSalary, formatPostedDate } from '../utils/jobMatching';
import AdminJobModal from '../components/admin/AdminJobModal';
import AdminSyncModal from '../components/admin/AdminSyncModal';
import JobDetailsModal from '../components/jobs/JobDetailsModal';
import { useToast } from '../contexts/ToastContext';

export default function AdminJobsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<AdminJobStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'company' | 'title' | 'salary'>('recent');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, statsData] = await Promise.all([
        fetchAdminJobs({
          search,
          status: statusFilter,
          company: companyFilter,
          department: departmentFilter,
          provider: providerFilter,
          sortBy,
          page,
          pageSize,
        }),
        fetchAdminJobStats(),
      ]);

      setJobs(res.jobs);
      setTotal(res.total);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
      showToast('Failed to load jobs data', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, companyFilter, departmentFilter, providerFilter, sortBy, page, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveJob = async (jobData: Omit<Job, 'id'> | Job) => {
    try {
      if ('id' in jobData && jobData.id) {
        await updateAdminJob(jobData.id, jobData);
        showToast('Job listing updated successfully', 'success');
      } else {
        await createAdminJob(jobData);
        showToast('New job listing created and published', 'success');
      }
      loadData();
    } catch (err) {
      showToast('Failed to save job listing', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (job: Job) => {
    const newStatus = !job.isActive;
    try {
      await toggleJobActiveStatus(job.id, newStatus);
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, isActive: newStatus } : j));
      showToast(newStatus ? 'Job activated' : 'Job drafted/hidden', 'success');
    } catch {
      showToast('Failed to change status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await deleteAdminJob(jobToDelete.id);
      showToast('Job listing permanently removed', 'success');
      setJobToDelete(null);
      loadData();
    } catch {
      showToast('Failed to delete job', 'error');
    }
  };

  const uniqueCompanies = Array.from(new Set(jobs.map(j => j.company))).filter(Boolean);
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="min-h-screen bg-neutral-50/60 text-neutral-900 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              CV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-neutral-900 tracking-tight">Job Feed Admin Panel</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                  <ShieldCheck size={11} className="text-neutral-600" />
                  Management
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">Manage listings, sync ATS career pages, and publish roles</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/dashboard/jobs')}
              className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={12} />
              <span>View Public Feed</span>
            </button>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Sync ATS Boards</span>
            </button>

            <button
              onClick={() => {
                setJobToEdit(null);
                setIsJobModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Total Ingested
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">{stats?.totalJobs ?? total}</span>
              <span className="text-[11px] text-neutral-500">roles</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Active / Published
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">{stats?.activeJobs ?? jobs.filter(j => j.isActive !== false).length}</span>
              <span className="text-[11px] text-emerald-700 font-medium">live</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Drafts / Hidden
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">{stats?.inactiveJobs ?? jobs.filter(j => j.isActive === false).length}</span>
              <span className="text-[11px] text-neutral-500">unlisted</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Remote Positions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">{stats?.remoteJobs ?? jobs.filter(j => j.workplaceType === 'Remote').length}</span>
              <span className="text-[11px] text-neutral-500">roles</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Hiring Companies
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">{stats?.totalCompanies ?? 50}</span>
              <span className="text-[11px] text-neutral-500">boards</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by role title, company name, or location..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Drafts Only</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={e => {
                  setCompanyFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900 max-w-[150px] truncate"
              >
                <option value="all">All Companies ({stats?.companies?.length || 0})</option>
                {(stats?.companies || []).map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={e => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="all">All Departments</option>
                {(stats?.departments && stats.departments.length > 0 ? stats.departments : [
                  'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Finance', 'Operations', 'Customer Support', 'Legal', 'People / HR'
                ]).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Provider Filter */}
              <select
                value={providerFilter}
                onChange={e => {
                  setProviderFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="all">All Providers</option>
                <option value="ashby">Ashby</option>
                <option value="greenhouse">Greenhouse</option>
                <option value="lever">Lever</option>
                <option value="manual">Manual</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="recent">Sort: Newest First</option>
                <option value="salary">Sort: Salary High</option>
                <option value="company">Sort: Company</option>
                <option value="title">Sort: Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Role Title & Company</th>
                  <th className="py-3 px-4">Location / Type</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-neutral-400" />
                      <span>Loading job listings...</span>
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500">
                      <Briefcase size={24} className="mx-auto mb-2 text-neutral-300" />
                      <p className="font-semibold text-neutral-900 text-sm">No job postings match your filters</p>
                      <p className="text-xs text-neutral-400 mt-1">Try changing your search terms or post a new role</p>
                    </td>
                  </tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Title & Company */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="flex items-center gap-2.5">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt=""
                              className="w-6 h-6 rounded-md object-contain border border-neutral-200 p-0.5 bg-white shrink-0"
                              onError={e => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                              <Building2 size={12} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-neutral-900 block truncate hover:underline cursor-pointer" onClick={() => setPreviewJob(job)}>
                              {job.title}
                            </span>
                            <span className="text-[11px] text-neutral-500 block truncate">
                              {job.company}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location & Workplace */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-neutral-900 font-medium">{job.location}</div>
                        {job.workplaceType && (
                          <span className="text-[10px] text-neutral-500">
                            {job.workplaceType}
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium text-[11px]">
                          {job.department || 'Other'}
                        </span>
                      </td>

                      {/* Salary */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-neutral-900">
                        {formatSalary(job.salary)}
                      </td>

                      {/* Published */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock size={11} className="text-neutral-400" />
                          <span>{formatPostedDate(job.postedAt) || job.postedDate}</span>
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="uppercase text-[10px] font-semibold tracking-wider text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                          {job.sourceProvider || 'manual'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                            job.isActive !== false
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${job.isActive !== false ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                          <span>{job.isActive !== false ? 'Active' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setPreviewJob(job)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="Preview Job Details"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setJobToEdit(job);
                              setIsJobModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="Edit Role"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => setJobToDelete(job)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing {jobs.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, total)} of {total} jobs
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-medium text-neutral-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AdminJobModal
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit}
        onSave={handleSaveJob}
      />

      <AdminSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncComplete={loadData}
      />

      {/* Details Preview Modal */}
      <JobDetailsModal
        job={previewJob}
        isOpen={Boolean(previewJob)}
        onClose={() => setPreviewJob(null)}
        isSaved={false}
        onToggleSave={() => {}}
        onTailorResume={() => {
          if (previewJob) {
            navigate('/dashboard/resumes');
          }
        }}
        onGenerateCoverLetter={() => {
          if (previewJob) {
            navigate('/dashboard/cover-letter');
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Delete Job Posting</h3>
            <p className="text-xs text-neutral-600">
              Are you sure you want to delete <span className="font-semibold text-neutral-900">"{jobToDelete.title}"</span> at {jobToDelete.company}? This action will permanently remove it from the feed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
