import {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  FocusField,
  Surface,
  Button,
  Dialog,
  Drawer,
  EmptyState,
  IconButton,
  InlineAlert,
  ListBox,
  Menu,
  Popover,
  SearchField,
  Select,
  SplitView,
  Stack,
  Switch,
  Table,
  Tabs,
  TextArea,
  ToggleButton,
  Toolbar,
  type Appearance,
  type MenuItems,
  type SplitViewCollapsedPane,
} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';
import {Tree} from '@trwhitney/component-library';
import {buildings, scenarios, type Scenario} from './data.js';
import {difference, differenceLabel, integer, number} from './energy.js';
import {Distribution, Monthly} from './charts.js';
import {Icon} from './icons.js';
import './styles.css';
function useNarrow(width: number) {
  const [narrow, setNarrow] = useState(() => matchMedia(`(max-width: ${width}px)`).matches);
  useEffect(() => {
    const media = matchMedia(`(max-width: ${width}px)`);
    const change = () => setNarrow(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, [width]);
  return narrow;
}
export function App() {
  const [activeId, setActiveId] = useState('building-10');
  const [pins, setPins] = useState<string[]>([]);
  const [investigations, setInvestigations] = useState<Record<string, string>>({
    'building-10': 'Review occupied and unoccupied schedules with the building team.',
  });
  const [search, setSearch] = useState('');
  const [expandedCampuses, setExpandedCampuses] = useState<readonly string[]>([
    'North',
    'Central',
    'South',
  ]);
  const [searchExpansion, setSearchExpansion] = useState<{
    key: string;
    ids: readonly string[];
  }>({key: '', ids: []});
  const [campus, setCampus] = useState<string | null>(null);
  const [kind, setKind] = useState<string | null>(null);
  const [tab, setTab] = useState<'distribution' | 'monthly' | 'readings'>('distribution');
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [scenario, setScenario] = useState<Scenario>('ready');
  const [available, setAvailable] = useState(buildings);
  const [refreshing, setRefreshing] = useState(false);
  const [failRefresh, setFailRefresh] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [identify, setIdentify] = useState(false);
  const [identified, setIdentified] = useState('');
  const [browserOpen, setBrowserOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<SplitViewCollapsedPane>(null);
  const [primarySize, setPrimarySize] = useState(65);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smallBrowser = useNarrow(760),
    smallQueue = useNarrow(1100);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const filtered = useMemo(
    () =>
      available.filter(
        (record) =>
          (!campus || record.campus === campus) &&
          (!kind || record.kind === kind) &&
          `${record.name} ${record.kind} ${record.campus}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [available, campus, kind, search],
  );
  const visibleCampuses = ['North', 'Central', 'South'].filter((place) =>
    filtered.some((record) => record.campus === place),
  );
  const searching = search.trim().length > 0;
  const expansionKey = JSON.stringify([search.trim().toLowerCase(), campus, kind, visibleCampuses]);
  const expandedIds = searching
    ? searchExpansion.key === expansionKey
      ? searchExpansion.ids
      : visibleCampuses
    : expandedCampuses;
  const changeExpansion = (ids: readonly string[]) => {
    if (searching) setSearchExpansion({key: expansionKey, ids});
    else
      setExpandedCampuses((previous) => [
        ...previous.filter((id) => !visibleCampuses.includes(id)),
        ...ids,
      ]);
  };
  const changeSearch = (value: string) => {
    setSearch(value);
    setSearchExpansion({key: '', ids: []});
  };
  const active = available.find((record) => record.id === activeId);
  const queued = buildings.filter((record) => Object.hasOwn(investigations, record.id));
  const compared = useMemo(
    () => available.filter((record) => record.id === activeId || pins.includes(record.id)),
    [available, activeId, pins],
  );
  const inspect = (id: string) => {
    if (!buildings.some((record) => record.id === id)) return;
    setActiveId(id);
    setBrowserOpen(false);
  };
  const toggleInvestigation = (id: string) => {
    const record = buildings.find((item) => item.id === id);
    if (!record) return;
    const exists = Object.hasOwn(investigations, id);
    setInvestigations((current) => {
      const next = {...current};
      if (exists) delete next[id];
      else next[id] = '';
      return next;
    });
    if (!exists) {
      setActiveId(id);
      setCollapsed(null);
    }
    setAnnouncement(`${record.name} ${exists ? 'removed from' : 'added to'} investigations.`);
  };
  const togglePin = (id: string) => {
    if (pins.includes(id)) setPins((current) => current.filter((item) => item !== id));
    else if (pins.length < 5) setPins((current) => [...current, id]);
    else setAnnouncement('Five comparison pins are in use. Unpin one to add another building.');
  };
  const actions = (id: string): MenuItems => [
    {type: 'action', id: 'inspect', label: 'Inspect building', onAction: () => inspect(id)},
    {
      type: 'action',
      id: 'investigate',
      label: Object.hasOwn(investigations, id)
        ? 'Remove from investigations'
        : 'Add to investigations',
      onAction: () => toggleInvestigation(id),
    },
    {
      type: 'action',
      id: 'pin',
      label: pins.includes(id) ? 'Unpin comparison' : 'Pin for comparison',
      onAction: () => togglePin(id),
    },
  ];
  const clearFilters = () => {
    changeSearch('');
    setCampus(null);
    setKind(null);
  };
  const chooseScenario = (next: Scenario) => {
    if (timer.current) clearTimeout(timer.current);
    setRefreshing(false);
    setScenario(next);
    setAvailable(
      ['loading', 'empty', 'unavailable'].includes(next)
        ? []
        : next === 'partial'
          ? buildings.filter((record) => record.campus !== 'South')
          : buildings,
    );
  };
  const refresh = () => {
    if (timer.current) clearTimeout(timer.current);
    setRefreshing(true);
    setFailRefresh(false);
    timer.current = setTimeout(() => {
      setRefreshing(false);
      if (failRefresh) {
        setScenario(available.length ? 'error' : 'unavailable');
        setAnnouncement('Refresh failed. Your work is preserved.');
      } else {
        setScenario('ready');
        setAvailable(buildings);
        setAnnouncement('Readings refreshed.');
      }
    }, 900);
  };
  const exportQueue = () => {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      ['Building', 'Campus', 'Use', 'Annual kWh/m²', 'Investigation reason'],
      ...queued.map((record) => [
        record.name,
        record.campus,
        record.kind,
        record.intensity,
        investigations[record.id]!,
      ]),
    ]
      .map((row) => row.map(quote).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campus-investigations-2025.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement(`Exported ${queued.length} investigations.`);
  };

  const browser = (
    <section
      className="building-browser"
      aria-label="Building browser"
      data-feedback="Building browser"
    >
      <div className="pane-heading">
        <h2>Buildings</h2>
        <span className="count">{filtered.length}</span>
        <Popover
          title="Building filters"
          description="Limit the browser and distribution."
          closeLabel="Close building filters"
          trigger={
            <IconButton label="Filter buildings" size="compact">
              <Icon name="filter" />
            </IconButton>
          }
        >
          <Stack gap="relaxed">
            <Select
              label="Campus"
              placeholder="All campuses"
              emptyMessage="No campuses"
              value={campus}
              onChange={setCampus}
              options={['North', 'Central', 'South'].map((value) => ({value, label: value}))}
            />
            <Select
              label="Building use"
              placeholder="All uses"
              emptyMessage="No uses"
              value={kind}
              onChange={setKind}
              options={['Office', 'Laboratory', 'Library'].map((value) => ({value, label: value}))}
            />
            <Button onPress={clearFilters}>Clear filters</Button>
          </Stack>
        </Popover>
      </div>
      <div className="browser-search">
        <SearchField
          label="Find a building"
          placeholder="Name, campus or use"
          clearLabel="Clear search"
          value={search}
          onChange={changeSearch}
        />
        {(campus || kind) && (
          <div className="filter-summary">
            <span>{[campus, kind].filter(Boolean).join(' · ')}</span>
            <Button size="compact" onPress={clearFilters}>
              Clear
            </Button>
          </div>
        )}
      </div>
      <div className="browser-records">
        <Tree
          contextMenu={{
            getLabel: (id) =>
              `Actions for ${buildings.find((record) => record.id === id)?.name ?? id}`,
            getItems: (id) => (buildings.some((record) => record.id === id) ? actions(id) : []),
          }}
          ariaLabel="Campus buildings"
          expandLabel="Expand campus"
          collapseLabel="Collapse campus"
          expandedIds={expandedIds}
          onExpandedChange={changeExpansion}
          selectionMode="single"
          selectedId={active && filtered.includes(active) ? activeId : null}
          onSelectionChange={(id) => {
            if (!id) return;
            if (visibleCampuses.includes(id)) {
              changeExpansion(
                expandedIds.includes(id)
                  ? expandedIds.filter((place) => place !== id)
                  : [...expandedIds, id],
              );
            } else inspect(id);
          }}
          items={['North', 'Central', 'South']
            .filter((place) => filtered.some((record) => record.campus === place))
            .map((place) => ({
              id: place,
              label: `${place} campus`,
              children: filtered
                .filter((record) => record.campus === place)
                .sort((a, b) => difference(b, available) - difference(a, available))
                .map((record) => ({
                  id: record.id,
                  label: record.name,
                  description: `${integer.format(record.intensity)} kWh/m² · ${differenceLabel(difference(record, available))}`,
                  actions: (
                    <span className="record-actions">
                      <IconButton
                        label={`${Object.hasOwn(investigations, record.id) ? 'Remove' : 'Investigate'} ${record.name}`}
                        size="compact"
                        onPress={() => toggleInvestigation(record.id)}
                      >
                        <Icon
                          name={Object.hasOwn(investigations, record.id) ? 'check' : 'investigate'}
                        />
                      </IconButton>

                      <IconButton
                        label={`${pins.includes(record.id) ? 'Unpin' : 'Pin'} ${record.name}`}
                        size="compact"
                        onPress={() => togglePin(record.id)}
                      >
                        <Icon name={pins.includes(record.id) ? 'unpin' : 'pin'} />
                      </IconButton>
                    </span>
                  ),
                })),
            }))}
          emptyState={{
            kind: 'no-results',
            title: available.length ? 'No matching buildings' : 'No readings',
            description: available.length
              ? 'Clear the filters to see buildings.'
              : 'Load the sample readings.',
            actionLabel: available.length ? 'Clear filters' : 'Load readings',
            onAction: available.length ? clearFilters : refresh,
          }}
        />
      </div>
      <div className="browser-foot">Annual readings · kWh per m²</div>
    </section>
  );
  const queue = (
    <section
      className="investigation-queue"
      aria-label="Investigation queue"
      data-feedback="Investigation queue"
    >
      <div className="pane-heading">
        <h2>Investigations</h2>
        <span className="count">{queued.length}</span>
        <IconButton
          label="Export investigations"
          size="compact"
          isDisabled={!queued.length}
          onPress={exportQueue}
        >
          <Icon name="export" />
        </IconButton>
      </div>
      {queued.length ? (
        <>
          <div className="queue-records">
            <ListBox
              ariaLabel="Investigation buildings"
              items={queued.map((record) => ({
                id: record.id,
                label: record.name,
                description: investigations[record.id]?.trim() || 'Reason not added',
              }))}
              selectionMode="single"
              selectedId={Object.hasOwn(investigations, activeId) ? activeId : null}
              onSelectionChange={(id) => {
                if (id) inspect(id);
              }}
              emptyState={{
                kind: 'no-data',
                title: 'No investigations',
                description: 'Add a building from the browser.',
              }}
            />
          </div>
          {Object.hasOwn(investigations, activeId) ? (
            <div className="reason-editor">
              <div className="reason-heading">
                <h3>{buildings.find((record) => record.id === activeId)?.name}</h3>
                <IconButton
                  label="Remove current investigation"
                  size="compact"
                  onPress={() => toggleInvestigation(activeId)}
                >
                  <Icon name="close" />
                </IconButton>
              </div>
              <TextArea
                label="Investigation reason"
                placeholder="What needs checking?"
                rows={5}
                value={investigations[activeId]!}
                onChange={(note) =>
                  setInvestigations((current) => ({...current, [activeId]: note}))
                }
              />
              <p className="muted">Included in the investigation export.</p>
            </div>
          ) : (
            <div className="queue-prompt">
              <p>Select an investigation to edit its reason.</p>
              {active && (
                <Button size="compact" onPress={() => toggleInvestigation(activeId)}>
                  Investigate {active.name}
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="queue-prompt">
          <EmptyState
            kind="no-data"
            title="No investigations yet"
            description="Keep buildings that need a closer look here."
            {...(active
              ? {
                  actionLabel: `Investigate ${active.name}`,
                  onAction: () => toggleInvestigation(activeId),
                }
              : {})}
          />
        </div>
      )}
    </section>
  );
  const readings = (
    <div className="readings-panel">
      <Table
        ariaLabel="Comparison readings"
        columns={[
          {id: 'name', label: 'Building', isRowHeader: true},
          {id: 'use', label: 'Use'},
          {id: 'annual', label: 'kWh/m²', align: 'end'},
          {id: 'area', label: 'Floor m²', align: 'end'},
          {id: 'peer', label: 'vs. peers', align: 'end'},
        ]}
        rows={compared.map((record) => ({
          id: record.id,
          textValue: record.name,
          cells: {
            name: record.name,
            use: record.kind,
            annual: number.format(record.intensity),
            area: integer.format(record.area),
            peer: differenceLabel(difference(record, available)),
          },
        }))}
        selectionMode="single"
        selectedId={activeId}
        onSelectionChange={(id) => {
          if (id) inspect(id);
        }}
        emptyState={{kind: 'no-data', title: 'No readings', description: 'Select a building.'}}
      />
    </div>
  );
  const analysis = (
    <div className="analysis-atmosphere">
      <FocusField isActive={refreshing && Boolean(active)}>
        <Surface focusFieldAnchor padding="regular">
          <section
            className="analysis-bench"
            aria-label="Energy analysis"
            data-feedback="Analysis bench"
          >
            {active ? (
              <>
                <div className="working-object">
                  <div>
                    <p className="eyebrow">
                      {active.campus} campus / {active.kind}
                    </p>
                    <h1>{active.name}</h1>
                    <p className="working-reading">
                      <strong>{integer.format(active.intensity)}</strong> kWh/m²{' '}
                      <span>{differenceLabel(difference(active, available))} vs. same use</span>
                    </p>
                  </div>
                  <Toolbar label="Current building actions">
                    <ToggleButton
                      size="compact"
                      isSelected={Object.hasOwn(investigations, activeId)}
                      onChange={() => toggleInvestigation(activeId)}
                    >
                      Investigate
                    </ToggleButton>
                    <ToggleButton
                      size="compact"
                      isSelected={pins.includes(activeId)}
                      onChange={() => togglePin(activeId)}
                    >
                      Pin comparison
                    </ToggleButton>
                  </Toolbar>
                </div>
                <div className="comparison-tray" role="group" aria-label="Comparison pins">
                  <span className="eyebrow">COMPARE WITH</span>
                  {pins.length ? (
                    pins.map((id) => {
                      const record = buildings.find((item) => item.id === id)!;
                      return (
                        <span className="comparison-pin" key={id}>
                          <Button size="compact" variant="quiet" onPress={() => inspect(id)}>
                            {record.name}
                          </Button>
                          <IconButton
                            label={`Unpin ${record.name} from comparison`}
                            size="compact"
                            variant="quiet"
                            onPress={() => togglePin(id)}
                          >
                            <Icon name="close" />
                          </IconButton>
                        </span>
                      );
                    })
                  ) : (
                    <span className="muted">Pin buildings from the browser</span>
                  )}
                </div>
                <div className="analysis-scroll">
                  <Tabs
                    ariaLabel="Analysis representation"
                    selectedId={tab}
                    onSelectionChange={setTab}
                    items={[
                      {
                        id: 'distribution',
                        label: 'Distribution',
                        panel: (
                          <Distribution records={filtered} active={active} onInspect={inspect} />
                        ),
                      },
                      {
                        id: 'monthly',
                        label: 'Monthly',
                        panel: <Monthly records={compared} onInspect={inspect} />,
                      },
                      {id: 'readings', label: 'Readings', panel: readings},
                    ]}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                kind={scenario === 'unavailable' ? 'unavailable' : 'no-data'}
                title={
                  scenario === 'loading' ? 'Loading readings' : 'Selected building unavailable'
                }
                description="Your pins and investigation notes are preserved."
                actionLabel="Load readings"
                onAction={refresh}
              />
            )}
          </section>
        </Surface>
      </FocusField>
    </div>
  );
  const error = scenario === 'error' || scenario === 'unavailable';
  const identifyTarget = (target: EventTarget) => {
    if (identify && target instanceof Element) {
      setIdentified(
        target.closest<HTMLElement>('[data-feedback]')?.dataset.feedback ||
          target.closest('button')?.getAttribute('aria-label') ||
          'Energy desk',
      );
    }
  };
  return (
    <AppearanceProvider density="compact" appearance={appearance} accent="#538dff">
      <div
        className="energy-app"
        onPointerOverCapture={(event) => identifyTarget(event.target)}
        onFocusCapture={(event) => identifyTarget(event.target)}
      >
        <header className="app-command-bar">
          <div className="app-identity">
            <Icon name="building" />
            <strong>Energy desk</strong>
            <span>Campus estate · 2025</span>
          </div>
          <div className="workspace-commands">
            {smallBrowser && (
              <Drawer
                title="Buildings"
                description="Choose the building to analyze."
                closeLabel="Close building browser"
                placement="start"
                isOpen={browserOpen}
                onOpenChange={setBrowserOpen}
                trigger={<Button size="compact">Buildings</Button>}
              >
                {browser}
              </Drawer>
            )}
            {smallQueue && (
              <Drawer
                title="Investigations"
                description="Review and export investigation reasons."
                closeLabel="Close investigation queue"
                placement="end"
                isOpen={queueOpen}
                onOpenChange={setQueueOpen}
                trigger={<Button size="compact">Investigations ({queued.length})</Button>}
              >
                {queue}
              </Drawer>
            )}
            <Button
              size="compact"
              onPress={refresh}
              isPending={refreshing}
              pendingLabel="Refreshing readings"
            >
              Refresh
            </Button>
            <Menu
              trigger={<Button size="compact">File</Button>}
              items={[
                {
                  type: 'action',
                  id: 'export',
                  label: 'Export investigations as CSV',
                  isDisabled: !queued.length,
                  onAction: exportQueue,
                },
                {
                  type: 'action',
                  id: 'clear-pins',
                  label: 'Clear comparison pins',
                  isDisabled: !pins.length,
                  onAction: () => setPins([]),
                },
              ]}
            />
            <Dialog
              title="Prototype settings"
              description="Fictional readings and simulated requests."
              closeLabel="Close prototype settings"
              trigger={
                <IconButton label="Prototype settings" size="compact">
                  <Icon name="settings" />
                </IconButton>
              }
            >
              <Stack>
                <Select
                  label="Data scenario"
                  emptyMessage="No scenarios"
                  options={scenarios}
                  value={scenario}
                  onChange={(next) => {
                    if (next) chooseScenario(next);
                  }}
                />
                <Select
                  label="Appearance"
                  emptyMessage="No appearances"
                  options={[
                    {value: 'dark', label: 'Dark'},
                    {value: 'light', label: 'Light'},
                  ]}
                  value={appearance}
                  onChange={(next) => {
                    if (next) setAppearance(next);
                  }}
                />
                <Switch
                  label="Fail the next refresh"
                  isSelected={failRefresh}
                  onChange={setFailRefresh}
                />
                <Switch
                  label="Identify regions and controls"
                  isSelected={identify}
                  onChange={setIdentify}
                />
                <Button
                  onPress={() => {
                    chooseScenario('ready');
                    clearFilters();
                    setPins([]);
                    setInvestigations({});
                    setActiveId('building-10');
                    setTab('distribution');
                    setAnnouncement('');
                    setFailRefresh(false);
                    setCollapsed(null);
                  }}
                >
                  Reset prototype
                </Button>
              </Stack>
            </Dialog>
          </div>
        </header>
        {(error || scenario === 'partial' || scenario === 'stale') && (
          <div className="workspace-feedback">
            <InlineAlert
              tone={error ? 'danger' : 'warning'}
              title={
                error
                  ? 'Refresh failed. Previous readings are retained.'
                  : scenario === 'partial'
                    ? 'South campus readings are missing.'
                    : 'Readings may be out of date.'
              }
            >
              <Button
                size="compact"
                onPress={refresh}
                isPending={refreshing}
                pendingLabel="Retrying readings"
              >
                Retry
              </Button>
            </InlineAlert>
          </div>
        )}
        <main className="workspace-grid" data-browser={!smallBrowser || undefined}>
          {!smallBrowser && browser}
          <div className="workbench-host">
            {smallQueue ? (
              analysis
            ) : (
              <SplitView
                ariaLabel="Analysis and investigation workspace"
                primaryLabel="Analysis bench"
                secondaryLabel="Investigation queue pane"
                resizeLabel="Resize analysis and investigations"
                collapsePrimaryLabel="Hide analysis"
                restorePrimaryLabel="Show analysis"
                collapseSecondaryLabel="Hide investigations"
                restoreSecondaryLabel="Show investigations"
                primarySize={primarySize}
                onPrimarySizeChange={setPrimarySize}
                minPrimarySize={50}
                maxPrimarySize={75}
                collapsedPane={collapsed}
                onCollapsedPaneChange={setCollapsed}
                primary={analysis}
                secondary={queue}
              />
            )}
          </div>
        </main>
        <footer className="app-status">
          <span role="status">
            {refreshing
              ? 'Refreshing readings…'
              : announcement ||
                `${available.length} buildings loaded · ${pins.length} comparison pins · ${queued.length} investigations`}
          </span>
          <span>Fictional data · Session only</span>
        </footer>
        {identify && <div className="feedback-name">{identified}</div>}
      </div>
    </AppearanceProvider>
  );
}
const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
