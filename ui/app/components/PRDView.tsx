'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { renderMarkdown } from '../lib/markdown';

// ── Types ────────────────────────────────────────────────────────────────────

type FileExt = 'md' | 'html' | 'docx' | 'other';

interface FileInfo {
  name: string;
  path: string;
  ext: FileExt;
}

interface CategorisedFiles {
  prd: FileInfo[];
  mockup: FileInfo[];
  research: FileInfo[];
  jtbd: FileInfo[];
}

interface ProjectFolder {
  name: string;
  fileCount: number;
}

type InnerTab = 'prd' | 'mockup' | 'research' | 'jtbd';

interface FileContent {
  content: string | null;
  type: 'md' | 'html' | 'docx' | 'other';
  filename?: string;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SidebarItem({
  project,
  active,
  onClick,
}: {
  project: ProjectFolder;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 14px',
        background: active ? '#FFE500' : 'transparent',
        borderLeft: active ? '4px solid #000' : '4px solid transparent',
        borderRight: 'none',
        borderTop: 'none',
        borderBottom: '1.5px solid #e0e0e0',
        cursor: 'pointer',
        textAlign: 'left',
        gap: '8px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: active ? 700 : 400,
          color: '#000',
          lineHeight: 1.3,
          flex: 1,
          wordBreak: 'break-word',
        }}
      >
        {project.name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-space-mono)',
          fontSize: '10px',
          color: active ? '#000' : '#888',
          background: active ? 'rgba(0,0,0,0.1)' : '#f0f0f0',
          padding: '1px 5px',
          flexShrink: 0,
        }}
      >
        {project.fileCount}
      </span>
    </button>
  );
}

function InnerTabBar({
  active,
  files,
  onChange,
}: {
  active: InnerTab;
  files: CategorisedFiles | null;
  onChange: (tab: InnerTab) => void;
}) {
  const tabs: { id: InnerTab; label: string }[] = [
    { id: 'prd', label: 'PRD' },
    { id: 'mockup', label: 'MOCKUP' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'jtbd', label: 'JTBD' },
  ];

  const countFor = (id: InnerTab) => (files ? files[id].length : 0);

  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '2.5px solid #000',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label }) => {
        const count = countFor(id);
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              background: active === id ? '#FFE500' : 'transparent',
              color: active === id ? '#000' : '#666',
              border: 'none',
              borderRight: '1.5px solid #000',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '10px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {label}
            {count > 0 && (
              <span
                style={{
                  background: active === id ? 'rgba(0,0,0,0.15)' : '#e8e8e8',
                  borderRadius: '0',
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '9px',
                  padding: '1px 4px',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MarkdownPane({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);
  return (
    <div
      style={{ padding: '24px', overflowY: 'auto', flex: 1 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function DocxPane({ filename }: { filename: string }) {
  return (
    <div style={{ padding: '32px', flex: 1, display: 'flex', alignItems: 'flex-start' }}>
      <div
        style={{
          border: '2.5px solid #000',
          boxShadow: '4px 4px 0 #000',
          padding: '20px 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '24px' }}>📄</span>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: '13px',
              marginBottom: '4px',
            }}
          >
            {filename}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#666',
            }}
          >
            This document is a .docx file — open it in Word or Google Docs to view.
          </div>
        </div>
      </div>
    </div>
  );
}

function HtmlPane({ files }: { files: FileInfo[] }) {
  const [selected, setSelected] = useState<FileInfo>(files[0]);

  useEffect(() => {
    setSelected(files[0]);
  }, [files]);

  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFile = useCallback((file: FileInfo) => {
    setSelected(file);
    setLoading(true);
    fetch(`/api/prd/content?path=${encodeURIComponent(file.path)}`)
      .then(r => r.json())
      .then((d: FileContent) => {
        setHtmlContent(d.content);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (files.length > 0) loadFile(files[0]);
  }, [files, loadFile]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {files.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 16px',
            borderBottom: '1.5px solid #000',
            flexWrap: 'wrap',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {files.map(f => (
            <button
              key={f.path}
              onClick={() => loadFile(f)}
              style={{
                background: selected.path === f.path ? '#FFE500' : '#f5f5f5',
                border: '1.5px solid #000',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: selected.path === f.path ? 700 : 400,
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-mono)',
            fontSize: '12px',
            color: '#888',
          }}
        >
          Loading…
        </div>
      )}

      {!loading && htmlContent && (
        <iframe
          srcDoc={htmlContent}
          style={{
            flex: 1,
            border: 'none',
            width: '100%',
          }}
          title={selected.name}
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {!loading && !htmlContent && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#888',
          }}
        >
          Could not load file.
        </div>
      )}
    </div>
  );
}

function EmptyPane({ message, buttonLabel, onButton }: { message: string; buttonLabel?: string; onButton?: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#888',
          textAlign: 'center',
          maxWidth: '360px',
        }}
      >
        {message}
      </div>
      {buttonLabel && onButton && (
        <button
          onClick={onButton}
          style={{
            background: '#FFE500',
            color: '#000',
            border: '2.5px solid #000',
            boxShadow: '3px 3px 0 #000',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.08em',
            padding: '8px 18px',
            cursor: 'pointer',
          }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

// ── PRD Tab Content ───────────────────────────────────────────────────────────

function PRDTabContent({ files }: { files: FileInfo[] }) {
  const [content, setContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (files.length === 0) { setContent(null); return; }
    // Prefer md over docx
    const target = files.find(f => f.ext === 'md') ?? files[0];
    setLoading(true);
    fetch(`/api/prd/content?path=${encodeURIComponent(target.path)}`)
      .then(r => r.json())
      .then((d: FileContent) => { setContent(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [files]);

  if (files.length === 0) {
    return (
      <EmptyPane message='No PRD doc found. Generate one via the terminal with /prd' />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '12px',
          color: '#888',
        }}
      >
        Loading…
      </div>
    );
  }

  if (!content) return null;

  if (content.type === 'md' && content.content) {
    return <MarkdownPane content={content.content} />;
  }

  if (content.type === 'docx') {
    return <DocxPane filename={content.filename ?? files[0].name} />;
  }

  return <EmptyPane message='No PRD doc found. Generate one via the terminal with /prd' />;
}

function ResearchTabContent({ files }: { files: FileInfo[] }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<FileInfo | null>(null);

  useEffect(() => {
    const mdFiles = files.filter(f => f.ext === 'md');
    if (mdFiles.length === 0) { setContent(null); setSelected(null); return; }
    const target = mdFiles[0];
    setSelected(target);
    setLoading(true);
    fetch(`/api/prd/content?path=${encodeURIComponent(target.path)}`)
      .then(r => r.json())
      .then((d: FileContent) => { setContent(d.content); setLoading(false); })
      .catch(() => setLoading(false));
  }, [files]);

  const loadFile = useCallback((file: FileInfo) => {
    setSelected(file);
    setLoading(true);
    fetch(`/api/prd/content?path=${encodeURIComponent(file.path)}`)
      .then(r => r.json())
      .then((d: FileContent) => { setContent(d.content); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const mdFiles = files.filter(f => f.ext === 'md');

  if (mdFiles.length === 0) {
    return <EmptyPane message='No research notes. Add a .md file to the PRD folder.' />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {mdFiles.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 16px',
            borderBottom: '1.5px solid #000',
            flexWrap: 'wrap',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {mdFiles.map(f => (
            <button
              key={f.path}
              onClick={() => loadFile(f)}
              style={{
                background: selected?.path === f.path ? '#FFE500' : '#f5f5f5',
                border: '1.5px solid #000',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: selected?.path === f.path ? 700 : 400,
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-mono)',
            fontSize: '12px',
            color: '#888',
          }}
        >
          Loading…
        </div>
      ) : content ? (
        <MarkdownPane content={content} />
      ) : null}
    </div>
  );
}

function JTBDTabContent({
  files,
  folderName,
  onGenerated,
}: {
  files: FileInfo[];
  folderName: string;
  onGenerated: () => void;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genOutput, setGenOutput] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  useEffect(() => {
    const mdFiles = files.filter(f => f.ext === 'md');
    if (mdFiles.length === 0) { setContent(null); return; }
    setLoading(true);
    fetch(`/api/prd/content?path=${encodeURIComponent(mdFiles[0].path)}`)
      .then(r => r.json())
      .then((d: FileContent) => { setContent(d.content); setLoading(false); })
      .catch(() => setLoading(false));
  }, [files]);

  const handleGenerate = async () => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setGenerating(true);
    setGenOutput('');
    try {
      const res = await fetch('/api/shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `/jtbd ${folderName}` }),
        signal: abort.signal,
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response');
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setGenOutput(acc);
      }
      onGenerated();
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        setGenOutput(`[error: ${(e as Error).message}]`);
      }
    } finally {
      abortRef.current = null;
      setGenerating(false);
    }
  };

  const hasJtbd = files.filter(f => f.ext === 'md').length > 0;

  if (!hasJtbd && !generating && !genOutput) {
    return (
      <EmptyPane
        message="No JTBD document found. Generate one from this PRD's research notes."
        buttonLabel='GENERATE JTBD'
        onButton={handleGenerate}
      />
    );
  }

  if (generating || genOutput) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1.5px solid #000',
            background: '#111',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#FFE500', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            {generating ? '⟳ Generating JTBD…' : '✓ Generation complete'}
          </span>
        </div>
        <pre
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            lineHeight: '1.6',
            background: '#0d0d0d',
            color: '#b0b0b0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {genOutput || '…'}
        </pre>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '12px',
          color: '#888',
        }}
      >
        Loading…
      </div>
    );
  }

  return content ? (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          padding: '8px 16px',
          borderBottom: '1.5px solid #e0e0e0',
          background: '#fff',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={handleGenerate}
          style={{
            background: 'transparent',
            border: '1.5px solid #000',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '9px',
            letterSpacing: '0.08em',
            padding: '3px 10px',
            cursor: 'pointer',
          }}
        >
          ↺ REGENERATE
        </button>
      </div>
      <MarkdownPane content={content} />
    </div>
  ) : null;
}

// ── Main PRDView ──────────────────────────────────────────────────────────────

export default function PRDView() {
  const [projects, setProjects] = useState<ProjectFolder[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [files, setFiles] = useState<CategorisedFiles | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);

  const [innerTab, setInnerTab] = useState<InnerTab>('prd');

  // Load project list
  useEffect(() => {
    setProjectsLoading(true);
    fetch('/api/prd')
      .then(r => r.json())
      .then((data: ProjectFolder[]) => {
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0].name);
        setProjectsLoading(false);
      })
      .catch(() => setProjectsLoading(false));
  }, []);

  // Load files for selected project
  useEffect(() => {
    if (!selectedProject) return;
    setFilesLoading(true);
    setFiles(null);
    fetch(`/api/prd/files?folder=${encodeURIComponent(selectedProject)}`)
      .then(r => r.json())
      .then((data: CategorisedFiles) => {
        setFiles(data);
        setFilesLoading(false);
      })
      .catch(() => setFilesLoading(false));
  }, [selectedProject]);

  const handleSelectProject = (name: string) => {
    setSelectedProject(name);
    setInnerTab('prd');
  };

  const refreshFiles = () => {
    if (!selectedProject) return;
    setFilesLoading(true);
    fetch(`/api/prd/files?folder=${encodeURIComponent(selectedProject)}`)
      .then(r => r.json())
      .then((data: CategorisedFiles) => { setFiles(data); setFilesLoading(false); })
      .catch(() => setFilesLoading(false));
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          borderRight: '2.5px solid #000',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFBF5',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            background: '#000',
            color: '#fff',
            padding: '10px 14px',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.12em',
            flexShrink: 0,
          }}
        >
          PRD PROJECTS
        </div>

        {/* Project list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {projectsLoading && (
            <div
              style={{
                padding: '20px 14px',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                color: '#888',
              }}
            >
              Loading…
            </div>
          )}
          {!projectsLoading && projects.length === 0 && (
            <div
              style={{
                padding: '20px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: '#888',
              }}
            >
              No PRD folders found.
            </div>
          )}
          {projects.map(p => (
            <SidebarItem
              key={p.name}
              project={p}
              active={selectedProject === p.name}
              onClick={() => handleSelectProject(p.name)}
            />
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FFFBF5' }}>
        {!selectedProject ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: '#888',
            }}
          >
            Select a project to get started.
          </div>
        ) : (
          <>
            {/* Project title bar */}
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '2.5px solid #000',
                background: '#fff',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '0.04em',
                }}
              >
                {selectedProject}
              </div>
            </div>

            {/* Inner tabs */}
            <InnerTabBar active={innerTab} files={files} onChange={setInnerTab} />

            {/* Tab content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {filesLoading && (
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '12px',
                    color: '#888',
                  }}
                >
                  Loading files…
                </div>
              )}

              {!filesLoading && files && (
                <>
                  {innerTab === 'prd' && <PRDTabContent files={files.prd} />}
                  {innerTab === 'mockup' && (
                    files.mockup.length > 0 ? (
                      <HtmlPane files={files.mockup} />
                    ) : (
                      <EmptyPane message='No mockup files found. Add .html files to the PRD folder.' />
                    )
                  )}
                  {innerTab === 'research' && <ResearchTabContent files={files.research} />}
                  {innerTab === 'jtbd' && selectedProject && (
                    <JTBDTabContent
                      files={files.jtbd}
                      folderName={selectedProject}
                      onGenerated={refreshFiles}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
