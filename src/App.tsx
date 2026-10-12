/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CompanyProject, JournalEntry, Invoice, Account } from './types/accounting';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { DEFAULT_CHART_OF_ACCOUNTS } from './data/defaultChartOfAccounts';
import { 
  calculateBalanceSheet, 
  calculateIncomeStatement 
} from './utils/accountingCalculations';

// Components
import { HeaderTheme } from './components/HeaderTheme';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { XiaomiDeviceFrame } from './components/XiaomiDeviceFrame';

// Tabs
import { DashboardTab } from './components/tabs/DashboardTab';
import { JournalTab } from './components/tabs/JournalTab';
import { LedgerTab } from './components/tabs/LedgerTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { CodingAndCycleTab } from './components/tabs/CodingAndCycleTab';

// Modals
import { JournalEntryFormModal } from './components/JournalEntryFormModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdjustingEntriesModal } from './components/AdjustingEntriesModal';
import { ClosingEntriesModal } from './components/ClosingEntriesModal';
import { CompanyModal } from './components/CompanyModal';
import { CalculatorModal } from './components/CalculatorModal';

const STORAGE_KEYS = {
  PROJECTS: 'hesabyar_projects_v1',
  CURRENT_PROJECT: 'hesabyar_current_proj_v1',
  ENTRIES: 'hesabyar_entries_v1',
  INVOICES: 'hesabyar_invoices_v1',
  ACCOUNTS: 'hesabyar_accounts_v1',
  DEVICE_FRAME: 'hesabyar_device_frame_v1'
};

export default function App() {
  // 1. Projects State
  const [projects, setProjects] = useState<CompanyProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_PROJECTS.map(s => s.project);
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_PROJECTS[0].project.id;
  });

  // 2. Entries State (Per Project)
  const [allEntries, setAllEntries] = useState<Record<string, JournalEntry[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initialMap: Record<string, JournalEntry[]> = {};
    SAMPLE_PROJECTS.forEach(s => {
      initialMap[s.project.id] = s.entries;
    });
    return initialMap;
  });

  // 3. Invoices State (Per Project)
  const [allInvoices, setAllInvoices] = useState<Record<string, Invoice[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const initialMap: Record<string, Invoice[]> = {};
    SAMPLE_PROJECTS.forEach(s => {
      initialMap[s.project.id] = s.invoices;
    });
    return initialMap;
  });

  // 4. Accounts State
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CHART_OF_ACCOUNTS;
  });

  // 5. Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 6. Device Frame Toggle (Xiaomi 11T Pro simulated bezel vs full viewport)
  const [isSimulatedDevice, setIsSimulatedDevice] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVICE_FRAME);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return false; // Default to natural mobile viewport, can toggle to mockup frame
  });

  // Modals Visibility
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isAdjustingModalOpen, setIsAdjustingModalOpen] = useState<boolean>(false);
  const [isClosingModalOpen, setIsClosingModalOpen] = useState<boolean>(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, currentProjectId);
  }, [currentProjectId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(allEntries));
  }, [allEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(allInvoices));
  }, [allInvoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_FRAME, JSON.stringify(isSimulatedDevice));
  }, [isSimulatedDevice]);

  // Derived Active Project Data
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0] || SAMPLE_PROJECTS[0].project;
  const projectEntries = allEntries[currentProject.id] || [];
  const projectInvoices = allInvoices[currentProject.id] || [];

  // Financial status
  const balanceSheet = calculateBalanceSheet(projectEntries, currentProject, accounts);
  const incomeStatement = calculateIncomeStatement(projectEntries, currentProject, 0, accounts);

  const nextEntryNumber = projectEntries.length > 0
    ? Math.max(...projectEntries.map(e => e.entryNumber)) + 1
    : 1;

  const nextInvoiceNumber = projectInvoices.length + 1;

  // Handlers
  const handleSaveEntry = (entry: JournalEntry) => {
    const existingIndex = projectEntries.findIndex(e => e.id === entry.id);
    let updatedEntries: JournalEntry[];

    if (existingIndex >= 0) {
      updatedEntries = [...projectEntries];
      updatedEntries[existingIndex] = entry;
    } else {
      updatedEntries = [...projectEntries, entry];
    }

    setAllEntries({
      ...allEntries,
      [currentProject.id]: updatedEntries
    });
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = projectEntries.filter(e => e.id !== entryId);
    setAllEntries({
      ...allEntries,
      [currentProject.id]: updatedEntries
    });
  };

  const handleSaveInvoice = (invoice: Invoice, generatedJournalEntry?: JournalEntry) => {
    const updatedInvoices = [...projectInvoices, invoice];
    let updatedEntries = [...projectEntries];

    if (generatedJournalEntry) {
      invoice.linkedJournalEntryId = generatedJournalEntry.id;
      updatedEntries.push(generatedJournalEntry);
    }

    setAllInvoices({
      ...allInvoices,
      [currentProject.id]: updatedInvoices
    });

    setAllEntries({
      ...allEntries,
      [currentProject.id]: updatedEntries
    });
  };

  const handleSaveClosingEntries = (closingEntries: JournalEntry[]) => {
    const updatedEntries = [...projectEntries, ...closingEntries];
    setAllEntries({
      ...allEntries,
      [currentProject.id]: updatedEntries
    });
    alert('اسناد بستن حساب‌های پایان دوره با موفقیت در دفتر روزنامه ثبت شدند.');
    setActiveTab('journal');
  };

  const handleCreateProject = (newProj: CompanyProject) => {
    setProjects([...projects, newProj]);
    setCurrentProjectId(newProj.id);
    setAllEntries({
      ...allEntries,
      [newProj.id]: []
    });
    setAllInvoices({
      ...allInvoices,
      [newProj.id]: []
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert('حداقل یک پروژه باید در سیستم فعال باشد و امکان حذف تنها پروژه موجود وجود ندارد.');
      return;
    }

    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);

    // If current project was deleted, switch to the first remaining one
    if (currentProjectId === projectId) {
      setCurrentProjectId(updatedProjects[0].id);
    }

    // Clean up stored entries and invoices for deleted project
    const updatedEntries = { ...allEntries };
    delete updatedEntries[projectId];
    setAllEntries(updatedEntries);

    const updatedInvoices = { ...allInvoices };
    delete updatedInvoices[projectId];
    setAllInvoices(updatedInvoices);
  };

  const handleAddNewAccount = (newAcc: Account) => {
    if (accounts.some(a => a.code === newAcc.code)) {
      alert('حسابی با این کد از قبل وجود دارد.');
      return;
    }
    setAccounts([...accounts, newAcc]);
    alert(`حساب «${newAcc.name}» با موفقیت به کدینگ اضافه گردید.`);
  };

  const handleExportAll = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      allEntries,
      allInvoices,
      accounts
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hesabyar_backup_${currentProject.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportProject = (data: any) => {
    if (data.projects && data.allEntries) {
      setProjects(data.projects);
      setAllEntries(data.allEntries);
      if (data.allInvoices) setAllInvoices(data.allInvoices);
      if (data.accounts) setAccounts(data.accounts);
      if (data.projects.length > 0) setCurrentProjectId(data.projects[0].id);
    }
  };

  const handleResetToSamples = () => {
    localStorage.clear();
    setProjects(SAMPLE_PROJECTS.map(s => s.project));
    setCurrentProjectId(SAMPLE_PROJECTS[0].project.id);
    const initialMap: Record<string, JournalEntry[]> = {};
    const initialInvMap: Record<string, Invoice[]> = {};
    SAMPLE_PROJECTS.forEach(s => {
      initialMap[s.project.id] = s.entries;
      initialInvMap[s.project.id] = s.invoices;
    });
    setAllEntries(initialMap);
    setAllInvoices(initialInvMap);
    setAccounts(DEFAULT_CHART_OF_ACCOUNTS);
  };

  return (
    <XiaomiDeviceFrame
      isSimulatedDevice={isSimulatedDevice}
      onToggleSimulatedDevice={() => setIsSimulatedDevice(!isSimulatedDevice)}
    >
      {/* Top Header Theme (Light modern fintech theme inspired by uploaded design reference) */}
      <HeaderTheme
        project={currentProject}
        totalAssets={balanceSheet.totalAssets}
        netIncome={incomeStatement.netIncome}
        isBalanced={balanceSheet.isBalanced}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenNewEntryModal={() => {
          setEditingEntry(null);
          setIsNewEntryModalOpen(true);
        }}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        onOpenAdjustingModal={() => setIsAdjustingModalOpen(true)}
        onOpenTrialBalanceTab={() => setActiveTab('reports')}
        onOpenCalculatorModal={() => setIsCalculatorModalOpen(true)}
        onOpenHelpModal={() => setActiveTab('tools')}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardTab
            project={currentProject}
            entries={projectEntries}
            onOpenNewEntry={() => {
              setEditingEntry(null);
              setIsNewEntryModalOpen(true);
            }}
            onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
            onOpenAdjustingModal={() => setIsAdjustingModalOpen(true)}
            onOpenClosingModal={() => setIsClosingModalOpen(true)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'journal' && (
          <JournalTab
            entries={projectEntries}
            project={currentProject}
            onOpenNewEntry={() => {
              setEditingEntry(null);
              setIsNewEntryModalOpen(true);
            }}
            onEditEntry={(entry) => {
              setEditingEntry(entry);
              setIsNewEntryModalOpen(true);
            }}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerTab
            entries={projectEntries}
            currency={currentProject.currency}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            entries={projectEntries}
            project={currentProject}
          />
        )}

        {activeTab === 'tools' && (
          <CodingAndCycleTab
            accounts={accounts}
            onAddNewAccount={handleAddNewAccount}
            onOpenClosingModal={() => setIsClosingModalOpen(true)}
            onOpenAdjustingModal={() => setIsAdjustingModalOpen(true)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Exact replicate of the uploaded reference photo) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenQuickAction={() => {
          setEditingEntry(null);
          setIsNewEntryModalOpen(true);
        }}
      />

      {/* Modals */}
      <JournalEntryFormModal
        isOpen={isNewEntryModalOpen}
        onClose={() => {
          setIsNewEntryModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        nextEntryNumber={nextEntryNumber}
        initialEntry={editingEntry}
        accounts={accounts}
        currency={currentProject.currency}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSaveInvoice={handleSaveInvoice}
        nextInvoiceNumber={nextInvoiceNumber}
        nextJournalEntryNumber={nextEntryNumber}
        currency={currentProject.currency}
      />

      <AdjustingEntriesModal
        isOpen={isAdjustingModalOpen}
        onClose={() => setIsAdjustingModalOpen(false)}
        onSaveEntry={handleSaveEntry}
        nextEntryNumber={nextEntryNumber}
        fiscalYear={currentProject.fiscalYear}
        currency={currentProject.currency}
      />

      <ClosingEntriesModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        entries={projectEntries}
        project={currentProject}
        nextEntryNumber={nextEntryNumber}
        onSaveClosingEntries={handleSaveClosingEntries}
      />

      <CompanyModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        currentProjectId={currentProject.id}
        onSelectProject={(id) => setCurrentProjectId(id)}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onExportAll={handleExportAll}
        onImportProject={handleImportProject}
        onResetToSamples={handleResetToSamples}
      />

      <CalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
    </XiaomiDeviceFrame>
  );
}
