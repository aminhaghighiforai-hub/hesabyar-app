import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Building2, 
  Check, 
  Download, 
  Upload, 
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CompanyProject, CompanyType, InventoryMethod, CurrencyUnit, JournalEntry, Invoice } from '../types/accounting';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: CompanyProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (project: CompanyProject) => void;
  onDeleteProject: (id: string) => void;
  onExportAll: () => void;
  onImportProject: (data: any) => void;
  onResetToSamples: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onExportAll,
  onImportProject,
  onResetToSamples
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<CompanyType>('merchandising');
  const [inventoryMethod, setInventoryMethod] = useState<InventoryMethod>('periodic');
  const [fiscalYear, setFiscalYear] = useState<string>('۱۴۰۳');
  const [currency, setCurrency] = useState<CurrencyUnit>('toman');
  const [description, setDescription] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('اصول حسابداری');

  // Deletion with 5-second countdown confirmation state
  const [projectToDelete, setProjectToDelete] = useState<CompanyProject | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  // Persian Toast/Popup notification state
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'warning' = 'warning') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (projectToDelete && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [projectToDelete, countdown]);

  const handleInitiateDelete = (e: React.MouseEvent, proj: CompanyProject) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      showToast('حداقل یک پروژه باید در سیستم فعال باشد و امکان حذف تنها پروژه موجود وجود ندارد.', 'warning');
      return;
    }
    setProjectToDelete(proj);
    setCountdown(5);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete || countdown > 0) return;
    onDeleteProject(projectToDelete.id);
    showToast(`پروژه «${projectToDelete.name}» با موفقیت حذف گردید.`, 'success');
    setProjectToDelete(null);
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
    setCountdown(5);
  };

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('لطفاً نام شرکت یا عنوان پروژه کلاسی را وارد نمایید.', 'warning');
      return;
    }

    const newProject: CompanyProject = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      type,
      inventoryMethod,
      fiscalYear: fiscalYear.trim() || '۱۴۰۳',
      currency,
      description: description.trim() || `پروژه کلاسی ${name}`,
      studentName: studentName.trim(),
      courseName: courseName.trim(),
      createdAt: new Date().toLocaleDateString('fa-IR'),
      updatedAt: new Date().toLocaleDateString('fa-IR')
    };

    showToast(`پروژه «${name.trim()}» با موفقیت ایجاد شد!`, 'success');
    setTimeout(() => {
      onCreateProject(newProject);
      setIsCreatingNew(false);
      setName('');
      onClose();
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportProject(json);
        alert('پروژه با موفقیت بارگذاری شد.');
      } catch (err) {
        alert('فایل نامعتبر است. لطفاً فایل JSON پشتیبان معتبر انتخاب کنید.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200 relative">
        
        {/* Persian Toast / Popup Notification (Green with deep shadow) */}
        {toast && (
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-full py-3 px-4 rounded-2xl shadow-2xl shadow-emerald-950/40 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white border border-emerald-300/50 ring-4 ring-emerald-500/20 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1 text-right text-xs sm:text-sm font-bold leading-snug drop-shadow-sm">
                {toast.message}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base">مدیریت شرکت‌ها و پروژه‌های کلاسی</h2>
              <p className="text-[11px] text-slate-300">انتخاب یا ایجاد پروژه جدید برای دوره‌ها</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {!isCreatingNew ? (
            <>
              {/* Projects List */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>پروژه‌های موجود ({projects.length})</span>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    تعریف پروژه جدید
                  </button>
                </div>

                <div className="space-y-2">
                  {projects.map(proj => {
                    const isSelected = proj.id === currentProjectId;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj.id);
                          onClose();
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300'
                            : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {proj.type === 'merchandising' ? 'بازرگانی' : proj.type === 'service' ? 'خدماتی' : 'تلفیقی'}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {proj.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>دوره مالی {proj.fiscalYear}</span>
                              <span>·</span>
                              <span>{proj.inventoryMethod === 'perpetual' ? 'ثبت دائمی' : 'ثبت ادواری'}</span>
                              <span>·</span>
                              <span>واحد: {proj.currency === 'toman' ? 'تومان' : 'ریال'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleInitiateDelete(e, proj)}
                            className="w-8 h-8 rounded-xl bg-slate-200/80 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                            title="حذف پروژه"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Backup & Tools Strip */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500">پشتیبان‌گیری و انتقال داده‌ها:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExportAll}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors min-w-0 overflow-hidden truncate"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">دانلود پشتیبان JSON</span>
                  </button>
                  <label className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center min-w-0 overflow-hidden truncate">
                    <Upload className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">بارگذاری فایل JSON</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (confirm('آیا مایلید پروژه‌ها به حالت پروژه‌های نمونه دانشگاهی بازنشانی شوند؟')) {
                      onResetToSamples();
                      onClose();
                    }
                  }}
                  className="w-full p-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  بازنشانی به پروژه‌های نمونه کلاسی اولیه
                </button>
              </div>
            </>
          ) : (
            /* NEW PROJECT FORM */
            <form noValidate onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-extrabold text-slate-900">مشخصات شرکت یا پروژه جدید</span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  بازگشت به لیست
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  نام شرکت یا عنوان پروژه کلاسی *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: شرکت بازرگانی دماوند (پروژه تمرینی ۱)"
                  className={`w-full text-xs bg-slate-50 border rounded-xl px-3 py-2 focus:outline-emerald-600 transition-all ${
                    toast && !name.trim()
                      ? 'border-emerald-500 ring-2 ring-emerald-300/60 bg-emerald-50/40'
                      : 'border-slate-200'
                  }`}
                />
                {toast && !name.trim() && (
                  <p className="text-[10px] text-emerald-800 font-bold mt-1 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    لطفاً نام شرکت یا پروژه کلاسی را وارد کنید.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">نوع شرکت</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as CompanyType)}
                    className="w-full text-[11px] sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-emerald-600 text-slate-800 truncate"
                  >
                    <option value="merchandising">شرکت بازرگانی</option>
                    <option value="service">شرکت خدماتی</option>
                    <option value="hybrid">شرکت تلفیقی (ترکیبی)</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">روش ثبت موجودی</label>
                  <select
                    value={inventoryMethod}
                    onChange={e => setInventoryMethod(e.target.value as InventoryMethod)}
                    className="w-full text-[11px] sm:text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-emerald-600 text-slate-800 truncate"
                  >
                    <option value="periodic">روش ادواری (کلاسی)</option>
                    <option value="perpetual">روش دائمی (مستمر)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">دوره / سال مالی</label>
                  <input
                    type="text"
                    value={fiscalYear}
                    onChange={e => setFiscalYear(e.target.value)}
                    placeholder="۱۴۰۳"
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-center focus:outline-emerald-600"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">واحد پول</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as CurrencyUnit)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-600 text-slate-800"
                  >
                    <option value="toman">تومان</option>
                    <option value="rial">ریال</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">نام دانشجو / حسابدار</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="نام و نام خانوادگی"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-600 truncate"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 truncate">نام درس / استاد</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="مثال: اصول حسابداری ۲"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-emerald-600 truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">توضیحات تکمیلی پروژه</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="موضوع پروژه، فرض‌های مسئله کلاسی و..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-600 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all truncate text-center"
                >
                  ایجاد پروژه و شروع حسابداری
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition-colors shrink-0 text-center"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

        </div>

        {/* 5-Second Confirmation Alert Modal for Project Deletion */}
        {projectToDelete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-rose-100 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  تأیید حذف قطعی پروژه کلاسی
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  آیا از حذف کامل پروژه <span className="font-bold text-slate-900">«{projectToDelete.name}»</span> و تمامی اسناد و دفاتر مالی آن اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
                </p>
              </div>

              {/* Countdown Indicator Strip */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-amber-700 font-bold">
                    <Clock className="w-4 h-4 animate-spin text-amber-600" />
                    <span>دکمه تایید پس از {countdown} ثانیه فعال می‌شود...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>زمان تأمل به پایان رسید. اکنون می‌توانید حذف را تأیید کنید.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleConfirmDelete}
                  className={`flex-1 py-3 px-2 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all truncate text-center ${
                    countdown === 0
                      ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-lg shadow-rose-600/30 cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                  }`}
                >
                  {countdown > 0 ? `حذف قطعی (${countdown} ثانیه)` : 'تأیید حذف قطعی'}
                </button>

                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="px-5 py-3 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0 text-center"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
