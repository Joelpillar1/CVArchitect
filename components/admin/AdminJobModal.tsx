import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building2, MapPin, DollarSign, Sparkles, Globe, Link as LinkIcon, Check } from 'lucide-react';
import { Job, Department, ExperienceLevel, JobType, WorkplaceType } from '../../types/job';

interface AdminJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: Job | null;
  onSave: (jobData: Omit<Job, 'id'> | Job) => Promise<void>;
}

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Legal',
  'HR',
  'Other'
];

const WORKPLACE_TYPES: WorkplaceType[] = ['Remote', 'Hybrid', 'On-site'];
const JOB_TYPES: JobType[] = ['FullTime', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Junior Level', 'Mid Level', 'Senior Level', 'Lead / Staff', 'Executive'];

export default function AdminJobModal({
  isOpen,
  onClose,
  jobToEdit,
  onSave,
}: AdminJobModalProps) {
  const isEditing = Boolean(jobToEdit);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState('');
  const [location, setLocation] = useState('');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Remote');
  const [jobType, setJobType] = useState<JobType>('FullTime');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid Level');
  const [department, setDepartment] = useState<Department>('Engineering');
  
  // Salary
  const [hasSalary, setHasSalary] = useState(true);
  const [salaryMin, setSalaryMin] = useState<number | ''>(120000);
  const [salaryMax, setSalaryMax] = useState<number | ''>(180000);
  const [salaryCurrency, setSalaryCurrency] = useState('$');
  const [salaryPeriod, setSalaryPeriod] = useState<'yearly' | 'monthly' | 'hourly'>('yearly');

  // Descriptions & Bullets
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  
  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // URLs & Status
  const [applyUrl, setApplyUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form on open
  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title || '');
      setCompany(jobToEdit.company || '');
      setCompanyLogo(jobToEdit.companyLogo || '');
      setCompanyWebsiteUrl(jobToEdit.companyWebsiteUrl || jobToEdit.sourceUrl || '');
      setLocation(jobToEdit.location || '');
      setWorkplaceType(jobToEdit.workplaceType || 'Remote');
      setJobType(jobToEdit.jobType || 'FullTime');
      setExperienceLevel(jobToEdit.experienceLevel || 'Mid Level');
      setDepartment(jobToEdit.department || 'Engineering');
      
      if (jobToEdit.salary && (jobToEdit.salary.min || jobToEdit.salary.max)) {
        setHasSalary(true);
        setSalaryMin(jobToEdit.salary.min ?? '');
        setSalaryMax(jobToEdit.salary.max ?? '');
        setSalaryCurrency(jobToEdit.salary.currency || '$');
        setSalaryPeriod(jobToEdit.salary.period || 'yearly');
      } else {
        setHasSalary(false);
        setSalaryMin('');
        setSalaryMax('');
      }

      setDescription(jobToEdit.description || '');
      setResponsibilities(jobToEdit.responsibilities && jobToEdit.responsibilities.length > 0 ? jobToEdit.responsibilities : ['']);
      setRequirements(jobToEdit.requirements && jobToEdit.requirements.length > 0 ? jobToEdit.requirements : ['']);
      setBenefits(jobToEdit.benefits && jobToEdit.benefits.length > 0 ? jobToEdit.benefits : ['']);
      setSkills(jobToEdit.skills || []);
      setApplyUrl(jobToEdit.applyUrl || '');
      setIsActive(jobToEdit.isActive !== false);
    } else {
      // Defaults for new job
      setTitle('');
      setCompany('');
      setCompanyLogo('');
      setCompanyWebsiteUrl('');
      setLocation('San Francisco, CA or Remote');
      setWorkplaceType('Remote');
      setJobType('FullTime');
      setExperienceLevel('Mid Level');
      setDepartment('Engineering');
      setHasSalary(true);
      setSalaryMin(120000);
      setSalaryMax(180000);
      setSalaryCurrency('$');
      setSalaryPeriod('yearly');
      setDescription('');
      setResponsibilities(['Architect scalable frontend applications and UI component systems.', 'Collaborate closely with product, engineering, and design teams.']);
      setRequirements(['4+ years of professional software engineering experience.', 'Proficiency in TypeScript, React, and modern web architectures.']);
      setBenefits(['Competitive equity package & 401(k) match', 'Comprehensive medical, dental, and vision health coverage', 'Flexible remote work & wellness stipends']);
      setSkills(['TypeScript', 'React', 'Next.js']);
      setApplyUrl('');
      setIsActive(true);
    }
    setError(null);
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddBullet = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const handleUpdateBullet = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveBullet = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const clean = skillInput.trim().replace(/,$/, '');
    if (clean && !skills.includes(clean)) {
      setSkills(prev => [...prev, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      setError('Job Title and Company Name are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Omit<Job, 'id'> | Job = {
      ...(jobToEdit ? { id: jobToEdit.id } : {}),
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo.trim() || (companyWebsiteUrl ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(companyWebsiteUrl.replace(/^https?:\/\//, '').split('/')[0])}&sz=128` : undefined),
      companyWebsiteUrl: companyWebsiteUrl.trim() || undefined,
      location: location.trim() || 'Location not specified',
      workplaceType,
      jobType,
      experienceLevel,
      department,
      salary: hasSalary && (salaryMin || salaryMax) ? {
        min: Number(salaryMin) || 0,
        max: Number(salaryMax) || Number(salaryMin) || 0,
        currency: salaryCurrency,
        period: salaryPeriod,
      } : null,
      description: description.trim(),
      responsibilities: responsibilities.map(r => r.trim()).filter(Boolean),
      requirements: requirements.map(r => r.trim()).filter(Boolean),
      benefits: benefits.map(b => b.trim()).filter(Boolean),
      skills,
      applyUrl: applyUrl.trim() || undefined,
      sourceUrl: companyWebsiteUrl.trim() || applyUrl.trim() || undefined,
      isActive,
      postedAt: jobToEdit?.postedAt || new Date().toISOString(),
      postedDate: jobToEdit?.postedDate || 'Just now',
      sourceProvider: jobToEdit?.sourceProvider || 'manual',
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save job. Please check all fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {isEditing ? 'Edit Job Posting' : 'Post New Job'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isEditing ? `Modify live details for "${jobToEdit?.title}"` : 'Create a new job listing to be published in the feed'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Primary Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Company Website / Careers URL
              </label>
              <input
                type="url"
                value={companyWebsiteUrl}
                onChange={e => setCompanyWebsiteUrl(e.target.value)}
                placeholder="https://company.com/careers"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. New York, NY or Remote"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Classification dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as Department)}
                className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-xs focus:outline-hidden focus:border-neutral-900"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Workplace
              </label>
              <select
                value={workplaceType || 'Remote'}
                onChange={e => setWorkplaceType(e.target.value as WorkplaceType)}
                className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-xs focus:outline-hidden focus:border-neutral-900"
              >
                {WORKPLACE_TYPES.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Job Type
              </label>
              <select
                value={jobType || 'FullTime'}
                onChange={e => setJobType(e.target.value as JobType)}
                className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-xs focus:outline-hidden focus:border-neutral-900"
              >
                {JOB_TYPES.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel || 'Mid Level'}
                onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 text-xs focus:outline-hidden focus:border-neutral-900"
              >
                {EXPERIENCE_LEVELS.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Section */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">Compensation Details</span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={hasSalary}
                  onChange={e => setHasSalary(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>Publish Salary Range</span>
              </label>
            </div>

            {hasSalary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Min Salary</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={e => setSalaryMin(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="120000"
                    className="w-full px-2.5 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Max Salary</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={e => setSalaryMax(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="180000"
                    className="w-full px-2.5 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Currency</label>
                  <select
                    value={salaryCurrency}
                    onChange={e => setSalaryCurrency(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="C$">C$ (CAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Period</label>
                  <select
                    value={salaryPeriod}
                    onChange={e => setSalaryPeriod(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Role Overview / Company Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write a clear overview of the team, product mission, and candidate profile..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-700">Key Responsibilities</label>
              <button
                type="button"
                onClick={() => handleAddBullet(setResponsibilities)}
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-900"
              >
                <Plus size={13} />
                <span>Add Bullet</span>
              </button>
            </div>
            <div className="space-y-2">
              {responsibilities.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={e => handleUpdateBullet(idx, e.target.value, setResponsibilities)}
                    placeholder={`Responsibility #${idx + 1}`}
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx, setResponsibilities)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-700">Role Requirements & Qualifications</label>
              <button
                type="button"
                onClick={() => handleAddBullet(setRequirements)}
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-900"
              >
                <Plus size={13} />
                <span>Add Bullet</span>
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={e => handleUpdateBullet(idx, e.target.value, setRequirements)}
                    placeholder={`Requirement #${idx + 1}`}
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx, setRequirements)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Required & Relevant Skills (Press Enter to add)
            </label>
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-wrap items-center gap-2">
              {skills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-neutral-400 hover:text-neutral-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder={skills.length === 0 ? "Type skill and press Enter (e.g. React, Go, Python)" : "Add skill..."}
                className="bg-transparent border-none text-xs focus:outline-hidden flex-1 min-w-[120px] py-1 px-1 text-neutral-900"
              />
            </div>
          </div>

          {/* Apply URL & Active Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Direct Application Link (ATS Apply URL)
              </label>
              <input
                type="url"
                value={applyUrl}
                onChange={e => setApplyUrl(e.target.value)}
                placeholder="https://jobs.ashbyhq.com/company/role-id or Greenhouse link"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs sm:text-sm"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span className="text-xs font-semibold text-neutral-900">
                  {isActive ? 'Active (Published)' : 'Draft (Hidden)'}
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check size={14} />
                <span>{isEditing ? 'Save Changes' : 'Create Job'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
