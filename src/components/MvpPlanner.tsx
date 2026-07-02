import React, { useState } from 'react';
import { MVPFeature, FeedbackNote } from '../types';
import { CheckCircle2, Circle, Clock, MessageSquare, Plus, Trash2, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MvpPlannerProps {
  features: MVPFeature[];
  setFeatures: React.Dispatch<React.SetStateAction<MVPFeature[]>>;
  notes: FeedbackNote[];
  setNotes: React.Dispatch<React.SetStateAction<FeedbackNote[]>>;
}

export default function MvpPlanner({ features, setFeatures, notes, setNotes }: MvpPlannerProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Core' | 'Interface' | 'Advanced'>('All');
  const [newNote, setNewNote] = useState('');
  const [customFeatureName, setCustomFeatureName] = useState('');
  const [customFeatureDesc, setCustomFeatureDesc] = useState('');
  const [customFeatureCategory, setCustomFeatureCategory] = useState<'Core' | 'Interface' | 'Advanced'>('Core');

  const filteredFeatures = features.filter(
    (f) => activeCategory === 'All' || f.category === activeCategory
  );

  const completedCount = features.filter((f) => f.status === 'completed').length;
  const progressPercent = Math.round((completedCount / features.length) * 100);

  const toggleFeatureStatus = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatusMap: Record<MVPFeature['status'], MVPFeature['status']> = {
            completed: 'planned',
            planned: 'in-progress',
            'in-progress': 'completed',
          };
          return { ...f, status: nextStatusMap[f.status] };
        }
        return f;
      })
    );
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeatureName.trim()) return;

    const newFeature: MVPFeature = {
      id: `custom_${Date.now()}`,
      title: customFeatureName,
      description: customFeatureDesc || 'User-defined calculation or interface standard.',
      status: 'planned',
      category: customFeatureCategory,
    };

    setFeatures((prev) => [...prev, newFeature]);
    setCustomFeatureName('');
    setCustomFeatureDesc('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: FeedbackNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newNote,
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6" id="mvp-planner-container">
      {/* Header Info */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-teal-600" />
          Interactive MVP Specification
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          This system lets you evaluate, refine, and customize the clinical calculator scope before deploying to native iOS devices. Every calculator below is fully interactive and runs completely offline.
        </p>

        {/* Progress Tracker */}
        <div className="pt-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>MVP Completion Status</span>
            <span>{completedCount} / {features.length} Features ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
        {(['All', 'Core', 'Interface', 'Advanced'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-950'
            }`}
            id={`tab-mvp-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feature Checklist */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((feat) => {
            const statusColors = {
              completed: 'bg-emerald-50 text-emerald-700 border-emerald-300',
              'in-progress': 'bg-amber-50 text-amber-700 border-amber-300',
              planned: 'bg-slate-50 text-slate-500 border-slate-200',
            };

            const statusLabel = {
              completed: 'Active MVP',
              'in-progress': 'In Progress',
              planned: 'Proposed',
            };

            return (
              <motion.div
                key={feat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 bg-white rounded-2xl border-2 transition-all hover:shadow-xs flex items-start justify-between gap-3 ${
                  feat.status === 'completed' ? 'border-teal-500/80' : 'border-slate-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                      {feat.category}
                    </span>
                    <button
                      onClick={() => toggleFeatureStatus(feat.id)}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-colors ${
                        statusColors[feat.status]
                      }`}
                    >
                      {statusLabel[feat.status]} (tap to shift)
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm mt-2">{feat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal font-medium">{feat.description}</p>
                </div>

                <button
                  onClick={() => toggleFeatureStatus(feat.id)}
                  className="mt-1 text-slate-300 hover:text-teal-600 transition-colors p-1"
                  aria-label={`Toggle status of ${feat.title}`}
                >
                  {feat.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  ) : feat.status === 'in-progress' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Custom Proposed Feature Formula */}
      <form onSubmit={handleAddCustomFeature} className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest px-1">Propose custom formula or feature</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="text"
              placeholder="e.g. BSA DuBois Formula"
              value={customFeatureName}
              onChange={(e) => setCustomFeatureName(e.target.value)}
              className="w-full p-3.5 text-sm font-bold bg-transparent outline-none"
            />
          </div>
          <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <select
              value={customFeatureCategory}
              onChange={(e) => setCustomFeatureCategory(e.target.value as any)}
              className="w-full p-3.5 text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="Core">Core Math</option>
              <option value="Interface">UI Component</option>
              <option value="Advanced">Advanced / Safety Guard</option>
            </select>
          </div>
        </div>
        <div className="flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
          <input
            type="text"
            placeholder="Short description of clinical calculation and expected dosage outputs..."
            value={customFeatureDesc}
            onChange={(e) => setCustomFeatureDesc(e.target.value)}
            className="w-full p-3.5 text-sm font-bold bg-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Proposed Scope Item
        </button>
      </form>

      {/* Interactive Nurses Notes & Evaluation Ideas */}
      <div className="bg-white border-2 border-slate-200 rounded-[24px] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 px-1">
          <MessageSquare className="w-4.5 h-4.5 text-slate-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Clinical Feedback & Requirements Notes</h3>
        </div>

        <form onSubmit={handleAddNote} className="flex gap-3">
          <div className="flex-1 flex border-2 border-slate-200 rounded-2xl bg-white focus-within:border-teal-500 transition-colors">
            <input
              type="text"
              placeholder="Type nursing flow ideas (e.g. 'Add GFR estimate', 'Default gtts/mL to 60')"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-3.5 text-sm font-bold bg-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center shrink-0"
          >
            Add Note
          </button>
        </form>

        <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
          <AnimatePresence>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4 font-semibold">No notes entered yet. Type ideas above to test interactive persistence!</p>
            ) : (
              notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-100"
                >
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 font-bold">{note.text}</p>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block font-bold">{note.timestamp}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
