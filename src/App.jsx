import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronRight,
  Command, Database, ExternalLink, Github, Layers3, Linkedin, Mail, MapPin, Menu, Moon,
  Search, SlidersHorizontal, Sun, TrendingUp, X,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { filters, financialSample, profile, projects, skillGroups } from './data.js';

const PROJECT_COUNT = projects.length;
const FEATURED_COUNT = projects.filter((project) => project.featured).length;

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('jpt-portfolio-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* private browsing */ }
    return 'dark';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1016' : '#f5f7f4');
    try { localStorage.setItem('jpt-portfolio-theme', theme); } catch { /* no storage available */ }
  }, [theme]);
  return [theme, () => setTheme((value) => value === 'dark' ? 'light' : 'dark')];
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

const formatMoney = (value) => '$' + Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });

function Brand({ onClick }) {
  return <a className="brand" href="#top" aria-label="John Paul Torres, back to top" onClick={onClick}>
    <span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
    <span className="brand-name">johnpaul<span className="brand-period">.</span><small>data / portfolio</small></span>
  </a>;
}

function Header({ theme, toggleTheme, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  useEffect(() => { if (menuOpen) document.body.classList.add('mobile-nav-open'); else document.body.classList.remove('mobile-nav-open'); return () => document.body.classList.remove('mobile-nav-open'); }, [menuOpen]);
  return <header className="site-header">
    <div className="shell header-inner">
      <Brand onClick={close} />
      <nav className={'main-nav' + (menuOpen ? ' is-open' : '')} aria-label="Main navigation">
        <a href="#work" onClick={close}>Work</a>
        <a href="#tableau" onClick={close}>Tableau</a>
        <a href="#expertise" onClick={close}>Expertise</a>
        <a href="#approach" onClick={close}>Approach</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#contact" onClick={close} className="mobile-contact-link">Connect <ArrowUpRight size={15} /></a>
      </nav>
      <div className="header-actions">
        <button className="header-icon command-trigger" onClick={onSearch} aria-label="Search projects" title="Search projects (Ctrl+K)"><Search size={18} /><span className="command-hint">⌘ K</span></button>
        <button className="header-icon theme-toggle" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'} title="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <a href="#contact" className="button button-small header-contact">Let's connect <ArrowUpRight size={15} /></a>
        <button className="header-icon menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
  </header>;
}

function TinyIcon({ icon: Icon, children }) {
  return <span className="tiny-meta"><Icon size={14} strokeWidth={1.8} />{children}</span>;
}

function FinanceTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip">
    <div className="tooltip-title">FY {label} <span>SAMPLE DATA</span></div>
    <strong>{metric === 'revenue' ? formatMoney(payload[0].value) : Number(payload[0].value).toFixed(1) + '%'}</strong>
    <small>{metric === 'revenue' ? 'Annual revenue' : 'Net profit margin'}</small>
  </div>;
}

function AnalyticsPreview() {
  const [metric, setMetric] = useState('revenue');
  const [hover, setHover] = useState(null);
  const isRevenue = metric === 'revenue';
  return <div className="preview-wrap">
    <div className="preview-halo" aria-hidden="true" />
    <div className="analytics-panel">
      <div className="panel-topbar">
        <div className="panel-topbar-left"><span className="panel-glyph"><BarChart3 size={15} /></span><span>Analytics workspace</span></div>
        <div className="panel-live"><span className="live-dot" /> CASE STUDY / 01</div>
      </div>
      <div className="panel-body">
        <div className="panel-report-heading"><div><div className="micro-label">FINANCIAL PERFORMANCE</div><h3>Revenue & profitability <span className="year-range">/ 2024–25</span></h3></div><div className="panel-dots" aria-hidden="true"><i /><i /><i /></div></div>
        <div className="metric-row">
          <div className="metric-primary"><div className="micro-label">2025 REVENUE <span className="sample-tag">SYNTHETIC</span></div><div className="metric-big">$1.01<span>M</span></div><div className="metric-change"><TrendingUp size={14} /> +21.1% <span>vs. 2024</span></div></div>
          <div className="metric-mini"><div className="micro-label">OVERALL MARGIN</div><div className="metric-mini-value">18.3<span>%</span></div><div className="metric-mini-caption">2024–25 sample</div></div>
        </div>
        <div className="chart-heading"><div><span className="chart-title">Performance overview</span><span className="chart-subtitle">Northstar Trading Co. / fictional dataset</span></div><div className="chart-switch" role="group" aria-label="Choose chart metric"><button type="button" aria-pressed={isRevenue} className={isRevenue ? 'active' : ''} onClick={() => setMetric('revenue')}>Revenue</button><button type="button" aria-pressed={!isRevenue} className={!isRevenue ? 'active' : ''} onClick={() => setMetric('margin')}>Margin</button></div></div>
        <div className="chart-area" aria-label={isRevenue ? '2024 revenue 836,955 dollars and 2025 revenue 1,013,160 dollars' : '2024 margin 18.5 percent and 2025 margin 18.2 percent'} role="img">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialSample} margin={{ top: 15, right: 1, bottom: 2, left: -20 }} barCategoryGap="40%" onMouseLeave={() => setHover(null)}>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Mono' }} dy={10} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-faint)', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={(val) => isRevenue ? '$' + (val / 1000000).toFixed(1) + 'm' : val + '%'} domain={isRevenue ? [0, 1200000] : [0, 24]} ticks={isRevenue ? [0, 400000, 800000, 1200000] : [0, 8, 16, 24]} />
              <Tooltip cursor={{ fill: 'var(--chart-hover)' }} content={<FinanceTooltip metric={metric} />} />
              <Bar dataKey={metric} radius={[6, 6, 0, 0]} maxBarSize={104} animationDuration={650} onMouseOver={(item) => setHover(item?.year)}>
                {financialSample.map((row, index) => <Cell key={row.year} fill={index === 1 ? 'var(--accent)' : 'var(--bar-muted)'} opacity={hover && hover !== row.year ? 0.6 : 1} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel-bottom"><span><span className="tiny-green-dot" /> Interactive chart · Hover to explore</span><span>Source: <a href="https://github.com/JP-bott/Financial-Performance-Dashboard" target="_blank" rel="noreferrer">Case study <ArrowUpRight size={11} /></a></span></div>
      </div>
    </div>
    <div className="floating-insight"><span className="float-icon"><Activity size={17} /></span><span><small>PROJECT FOCUS</small><strong>Questions → Insights</strong></span><span className="float-bars" aria-hidden="true"><i /><i /><i /><i /></span></div>
  </div>;
}

function Hero() {
  return <section className="hero-section" id="top">
    <div className="hero-grid-bg" aria-hidden="true" />
    <div className="shell hero-layout">
      <div className="hero-copy" data-reveal>
        <div className="eyebrow hero-eyebrow"><span className="eyebrow-mark" /> OPEN TO ANALYTICS OPPORTUNITIES <span className="eyebrow-line" /></div>
        <div className="hero-identity">HELLO, I'M JOHN PAUL TORRES <span>↗</span></div>
        <h1>Making<br /><span className="hero-title-accent">information</span><br />useful<span className="headline-period">.</span></h1>
        <p className="hero-description">Aspiring data analyst focused on turning complex data into clear stories, practical dashboards, and better-informed decisions.</p>
        <div className="hero-cta"><a className="button button-primary" href="#work">Explore my work <ArrowUpRight size={18} /></a></div>
        <div className="hero-bottom-note"><span className="note-rule" /><span>PYTHON &nbsp;/&nbsp; SQL &nbsp;/&nbsp; VISUAL ANALYTICS</span></div>
      </div>
      <div className="hero-visual" data-reveal><AnalyticsPreview /></div>
    </div>
    <div className="shell hero-footer"><span className="scroll-invite">SCROLL TO DISCOVER <ArrowDown size={14} /></span><span>BASED IN THE PHILIPPINES <span className="text-accent">✳</span> BUILDING WITH CURIOSITY</span></div>
  </section>;
}

function ProjectArtwork({ project }) {
  const common = <><defs><pattern id={'grid-' + project.id} width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" stroke="currentColor" strokeOpacity=".08" fill="none" /></pattern><linearGradient id={'fill-' + project.id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--project-accent)" stopOpacity=".43" /><stop offset="1" stopColor="var(--project-accent)" stopOpacity=".01" /></linearGradient></defs><rect width="560" height="285" fill={'url(#grid-' + project.id + ')'} /></>;
  const visual = (() => {
    switch (project.visual) {
      case 'economy': return <>
        <g transform="translate(30 27)">
          <text x="6" y="13" className="art-small">PHILIPPINE ECONOMIC ATLAS</text>
          <text x="6" y="31" className="art-number">18 REGIONS / PSA DATA</text>
          <g transform="translate(42 50)">
            <path d="M83 5L100 17L95 32L111 42L101 57L113 74L98 91L83 86L73 66L60 51L66 34L60 20Z" fill="var(--project-accent)" opacity=".3" stroke="var(--project-accent)" strokeWidth="1.2"/>
            <path d="M48 70L60 82L56 107L38 116L24 103L30 84Z" fill="var(--project-accent)" opacity=".55"/>
            <path d="M90 108L111 98L125 110L118 126L100 130Z" fill="var(--project-accent)" opacity=".77"/>
            <path d="M118 141L137 128L157 141L165 162L149 178L131 166Z" fill="var(--project-accent)" opacity=".4"/>
            <path d="M169 146L186 149L189 173L177 193L163 181Z" fill="var(--project-accent)" opacity=".62"/>
            <path d="M108 181L120 180L128 196L115 206L103 196Z" fill="var(--project-accent)" opacity=".27"/>
            <circle cx="139" cy="114" r="13" fill="none" stroke="var(--project-accent)" strokeWidth="1.5" strokeDasharray="3 4"/>
            <circle cx="139" cy="114" r="3.5" fill="var(--project-accent)"/>
            <path d="M139 114L201 93" stroke="var(--project-accent)" strokeDasharray="3 5" opacity=".65"/>
            <rect x="190" y="73" width="98" height="35" rx="7" fill="var(--art-card)" stroke="var(--art-line)"/>
            <text x="202" y="88" className="art-small">REGIONAL VIEW</text>
            <text x="202" y="101" className="art-number">GDP / CPI / LFS</text>
          </g>
        </g>
        <g transform="translate(370 61)">
          <rect width="160" height="178" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/>
          <text x="16" y="26" className="art-small">ECONOMIC TRENDS</text>
          <path d="M18 141H141M18 100H141M18 59H141" fill="none" stroke="var(--art-line)" strokeDasharray="3 5"/>
          <path d="M18 132L43 118L69 125L96 94L117 98L143 62" stroke="var(--project-accent)" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="143" cy="62" r="4.5" fill="var(--project-accent)"/>
          <text x="17" y="162" className="art-small">2018 / 2025</text>
        </g>
      </>;
      case 'geo': return <><g stroke="var(--project-accent)" fill="none" opacity=".16" strokeWidth="1"><path d="M100 54L188 98L270 60L359 108L448 72M95 174L166 218L284 180L402 234L473 178M188 98L166 218M270 60L284 180M359 108L402 234M448 72L473 178" /></g><g fill="var(--project-accent)" opacity=".1"><path d="M213 32l38 17-3 29 34 18-15 24 13 19-30 39 14 18-33 26-21-13-10-35-32-18-4-37 21-18-3-30z" /></g><g stroke="var(--project-accent)" strokeWidth="2.6" fill="none" strokeLinecap="round"><path d="M158 158Q226 30 335 117T462 137" strokeDasharray="5 9"/><path d="M147 209Q245 161 334 117" opacity=".65"/></g>{[[158,158],[335,117],[462,137],[147,209],[265,72]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="12" fill="var(--project-accent)" opacity=".13" /><circle cx={x} cy={y} r="4.5" fill="var(--project-accent)" /></g>)}<rect x="37" y="38" width="132" height="54" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><text x="53" y="59" className="art-small">SHIPMENT NETWORK</text><text x="53" y="78" className="art-number">PH / REGIONS</text><rect x="366" y="199" width="146" height="46" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><text x="383" y="218" className="art-small">CORRIDOR ANALYSIS</text><path d="M383 231H495" stroke="var(--project-accent)" strokeWidth="3" strokeLinecap="round" /></>;
      case 'retail': return <><g transform="translate(44 42)"><text y="1" className="art-small">REVENUE BY PERIOD</text><path d="M0 181H462" stroke="currentColor" strokeOpacity=".25"/><path d="M0 137H462M0 93H462M0 49H462" stroke="currentColor" strokeOpacity=".11" strokeDasharray="4 6"/>{[65,92,73,116,141,102,151,124,174,160,199,213].map((h,i)=><rect key={i} x={14+i*37} y={180-h*.78} width="22" height={h*.78} rx="4" fill="var(--project-accent)" opacity={.26+i*.057}/>) }<path d="M25 115L62 103L99 111L136 84L173 77L210 98L247 66L284 78L321 53L358 57L395 40L432 24" fill="none" stroke="var(--art-bright)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></g><rect x="333" y="28" width="177" height="52" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><text x="349" y="49" className="art-small">RELATIONAL ANALYSIS</text><text x="349" y="67" className="art-number">SQL → PYTHON</text></>;
      case 'finance': return <><text x="40" y="45" className="art-small">PROFITABILITY OVERVIEW</text><path d="M38 215H525M38 166H525M38 117H525M38 68H525" stroke="currentColor" strokeOpacity=".12" strokeDasharray="4 6"/><path d="M41 208C93 208 96 177 143 178S224 119 275 138S351 103 396 108S473 56 518 65V240H41Z" fill={'url(#fill-' + project.id + ')'} /><path d="M41 208C93 208 96 177 143 178S224 119 275 138S351 103 396 108S473 56 518 65" fill="none" stroke="var(--project-accent)" strokeWidth="3.5" strokeLinecap="round"/><circle cx="396" cy="108" r="6" fill="var(--project-accent)" stroke="var(--art-bg)" strokeWidth="3"/><rect x="336" y="121" width="154" height="62" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><text x="352" y="143" className="art-small">MEASURE WHAT MATTERS</text><text x="352" y="166" className="art-number">REVENUE / MARGIN</text></>;
      case 'inventory': return <><text x="39" y="38" className="art-small">INVENTORY HEALTH MATRIX</text>{Array.from({length:40},(_,i)=>{const n=(i*13+3)%19;return <rect key={i} x={42+(i%10)*37} y={55+Math.floor(i/10)*38} width="28" height="28" rx="5" fill="var(--project-accent)" opacity={.12+n*.038}/>})}<rect x="421" y="52" width="97" height="154" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><text x="436" y="73" className="art-small">STOCK LEVEL</text>{[25,54,39,61,45].map((w,i)=><g key={i}><rect x="436" y={90+i*23} width="62" height="7" rx="3" fill="var(--art-line)"/><rect x="436" y={90+i*23} width={w} height="7" rx="3" fill="var(--project-accent)" opacity={.55+i*.09}/></g>)}<text x="42" y="242" className="art-number">PRODUCTS / REORDER / SUPPLIERS</text></>;
      case 'markets': return <><text x="35" y="35" className="art-small">PRICE & VOLATILITY STUDY</text><path d="M35 230H522M35 180H522M35 130H522M35 80H522" stroke="currentColor" strokeOpacity=".12" strokeDasharray="4 6"/>{Array.from({length:26},(_,i)=>{const base=115+Math.sin(i*.95)*35+i*-1.4;const isUp=i%4!==0;return <g key={i} stroke={isUp?'var(--project-accent)':'var(--art-bright)'} opacity={.45+i*.02}><line x1={45+i*18} x2={45+i*18} y1={base-31} y2={base+43} strokeWidth="1.6"/><rect x={40+i*18} y={isUp?base-9:base-3} width="10" height="27" rx="2" fill={isUp?'var(--project-accent)':'var(--art-bright)'} stroke="none" /></g>})}<path d="M42 188C110 196 148 163 198 160S299 142 345 123S441 144 512 83" stroke="var(--art-bright)" opacity=".75" strokeWidth="2.5" fill="none" strokeLinecap="round" /></>;
      case 'logistics': return <><text x="38" y="42" className="art-small">ON-TIME PERFORMANCE</text><path d="M40 209H523M40 162H523M40 115H523M40 68H523" stroke="currentColor" strokeOpacity=".1" strokeDasharray="4 6"/>{[43,68,80,72,107,92,119,135,123,143,162].map((h,i)=><rect key={i} x={49+i*39} y={221-h} width="20" height={h} rx="4" fill="var(--project-accent)" opacity={.2+i*.06}/>) }<path d="M58 156L97 142L136 147L175 128L214 136L253 99L292 118L331 96L370 106L409 83L448 72" fill="none" stroke="var(--art-bright)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></>;
      case 'invoice': return <><rect x="68" y="37" width="425" height="213" rx="10" fill="var(--art-card)" stroke="var(--art-line)"/><rect x="68" y="37" width="425" height="35" rx="10" fill="var(--project-accent)" opacity=".11"/><text x="87" y="59" className="art-small">OPERATIONS / INVOICE OVERVIEW</text>{['CLIENT','AMOUNT','STATUS'].map((t,i)=><text key={t} x={[88,278,394][i]} y="98" className="art-small">{t}</text>)}{[0,1,2,3].map(i=><g key={i}><path d={'M87 '+(110+i*31)+'H474'} stroke="var(--art-line)"/><rect x="88" y={122+i*31} width={84+i*9} height="5" rx="2" fill="currentColor" opacity=".18"/><rect x="278" y={120+i*31} width="58" height="7" rx="2" fill="currentColor" opacity=".27"/><rect x="400" y={116+i*31} width="56" height="17" rx="8" fill="var(--project-accent)" opacity={.12+i*.07}/></g>)}</>;
      case 'bid': return <><rect x="37" y="40" width="490" height="195" rx="12" fill="var(--art-card)" stroke="var(--art-line)"/><rect x="58" y="61" width="196" height="26" rx="6" fill="var(--project-accent)" opacity=".18"/><text x="72" y="79" className="art-small">SEARCH OPPORTUNITIES</text>{[0,1,2].map(i=><g key={i}><rect x="58" y={104+i*40} width="447" height="32" rx="7" fill="var(--project-accent)" opacity={i===1?.15:.065}/><circle cx="77" cy={120+i*40} r="5" fill="var(--project-accent)" opacity=".65"/><rect x="91" y={116+i*40} width={155+i*15} height="6" rx="3" fill="currentColor" opacity=".28"/><rect x="384" y={115+i*40} width="98" height="9" rx="5" fill="var(--project-accent)" opacity=".5"/></g>)}</>;
      case 'extension': return <><rect x="46" y="34" width="468" height="216" rx="12" fill="var(--art-card)" stroke="var(--art-line)"/><rect x="46" y="34" width="468" height="34" rx="12" fill="var(--project-accent)" opacity=".1"/><circle cx="68" cy="51" r="4" fill="var(--project-accent)"/><circle cx="82" cy="51" r="4" fill="currentColor" opacity=".2"/><rect x="102" y="45" width="277" height="13" rx="6" fill="currentColor" opacity=".07"/><rect x="320" y="86" width="177" height="147" rx="9" fill="var(--project-accent)" opacity=".11"/>{[0,1,2,3,4].map(i=><g key={i}><rect x="68" y={92+i*27} width={i%2?205:224} height="7" rx="3" fill="currentColor" opacity=".16"/><rect x={i%2?178:124} y={92+i*27} width={i%2?56:81} height="8" rx="3" fill="var(--project-accent)" opacity=".75"/></g>)}<text x="340" y="111" className="art-small">MATCHES FOUND</text><text x="340" y="154" className="art-number">KEYWORD LAYER</text><rect x="340" y="174" width="121" height="27" rx="6" fill="var(--project-accent)" opacity=".5"/></>;
      default: return null;
    }
  })();
  return <div className={'project-art art-' + project.visual + ' accent-' + project.accent} aria-hidden="true">
    <div className="art-window-label"><span className="art-window-dots"><i /><i /><i /></span><span>PROJECT / {project.number}</span><span className="art-window-status">●</span></div>
    <svg viewBox="0 0 560 285" role="presentation" preserveAspectRatio="xMidYMid meet">{common}{visual}</svg>
  </div>;
}

function ProjectCard({ project, onOpen }) {
  const handleMove = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    event.currentTarget.style.setProperty('--pointer-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  };
  return <article className={'project-card accent-' + project.accent} onMouseMove={handleMove}>
    <div className="project-card-glow" aria-hidden="true" />
    <button className="project-art-button" type="button" onClick={() => onOpen(project)} aria-label={'View case study: ' + project.title}><ProjectArtwork project={project} /><span className="art-open"><ArrowUpRight size={17} /></span></button>
    <div className="card-content"><div className="card-overline"><span>{project.domain}</span><span>{project.number} / {String(PROJECT_COUNT).padStart(2, '0')}</span></div><div className="card-title-row"><h3>{project.title}</h3></div><p>{project.subtitle}</p><div className="card-tags">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
  </article>;
}

function Work({ onOpen }) {
  const [filter, setFilter] = useState('All work');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef(null);
  const matching = useMemo(() => projects.filter((project) => {
    const inCategory = filter === 'All work' || project.category === filter;
    const needle = search.trim().toLowerCase();
    const matchesSearch = !needle || [project.title, project.subtitle, project.domain, project.description, ...project.tags].join(' ').toLowerCase().includes(needle);
    return inCategory && matchesSearch;
  }), [filter, search]);
  const visible = showAll || filter !== 'All work' || search ? matching : matching.slice(0, 6);
  return <section className="section work-section" id="work"><div className="shell">
    <div className="section-heading work-heading" data-reveal><div><div className="section-index"><span>01</span> / SELECTED WORK</div><h2>Built to answer<br /><em>real questions.</em></h2></div><div className="section-intro"><p>Dashboards, reproducible analyses and data applications. Each project starts with a question and ends with something you can explore.</p><span className="section-count"><span className="count-dot" /> {String(PROJECT_COUNT).padStart(2, '0')} PROJECTS IN THE COLLECTION</span></div></div>
    <div className="work-toolbar"><div className="filter-row" role="group" aria-label="Filter projects by discipline">{filters.map((item) => <button key={item} type="button" onClick={() => { setFilter(item); setShowAll(false); }} aria-pressed={item === filter} className={'filter-pill' + (item === filter ? ' is-selected' : '')}>{item}</button>)}</div><label className="project-search"><Search size={16} /><input ref={inputRef} value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Find a project..." aria-label="Search projects" /><kbd>/</kbd></label></div>
    <div className="results-meta"><span>SHOWING <strong>{visible.length}</strong> OF <strong>{matching.length}</strong> MATCHING PROJECTS</span><span><SlidersHorizontal size={13} /> CURATED / GITHUB</span></div>
    {matching.length ? <div className="projects-grid">{visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div> : <div className="empty-projects"><Search size={24} /><h3>No matching projects</h3><p>Try another keyword or select a different category.</p><button onClick={() => { setFilter('All work'); setSearch(''); inputRef.current?.focus(); }}>Clear filters <ArrowRight size={16} /></button></div>}
    {!showAll && filter === 'All work' && !search && matching.length > visible.length && <div className="all-work-area"><button type="button" className="button button-outline" onClick={() => setShowAll(true)}>View all {PROJECT_COUNT} projects <ArrowDown size={17} /></button><span>MORE PROJECTS / APPLIED DATA PRODUCTS</span></div>}
    <p className="synthetic-note"><span className="note-asterisk">✳</span> Sample dashboards use synthetic datasets unless explicitly stated otherwise. Illustrative card visuals are design representations, not screenshots of deployed apps.</p>
  </div></section>;
}


const TABLEAU_URL = profile.tableau;

function TableauCard({ viz, onPreview }) {
  const [imageError, setImageError] = useState(false);
  return <article className="tableau-card">
    <button className="tableau-image" onClick={() => onPreview(viz)} aria-label={'Preview '+viz.title}>
      {!imageError ? <img src={viz.thumbnail} alt={'Tableau thumbnail for '+viz.title} loading="lazy" onError={() => setImageError(true)}/> : <span className="tableau-image-placeholder"><BarChart3 size={36}/>TABLEAU PUBLIC</span>}
      <span className="tableau-image-action">Preview visualization <ArrowUpRight size={14}/></span>
    </button>
    <div className="tableau-card-body">
      <div className="tableau-card-meta"><span><i/> PUBLISHED VISUALIZATION</span>{viz.published && <time dateTime={viz.published}>{new Date(viz.published+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'})}</time>}</div>
      <h3>{viz.title}</h3>
      {viz.description && <p>{viz.description}</p>}
      <div className="tableau-card-bottom"><small>{viz.views != null ? new Intl.NumberFormat('en-US').format(viz.views)+' views' : 'Interactive dashboard'}</small><a href={viz.url} target="_blank" rel="noopener noreferrer">View on Tableau <ExternalLink size={14}/></a></div>
    </div>
  </article>;
}

function TableauPreview({ viz, onClose }) {
  const closeRef=useRef(null);
  const modalRef=useRef(null);
  useEffect(()=>{
    const previousFocus=document.activeElement;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';closeRef.current?.focus();
    const key=(event)=>{
      if(event.key==='Escape'){event.preventDefault();onClose();}
      if(event.key==='Tab'){
        const controls=[...modalRef.current.querySelectorAll('button,a[href]')];
        if(event.shiftKey && document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}
        if(!event.shiftKey && document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}
      }
    };
    document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=previousOverflow;previousFocus?.focus?.();};
  },[onClose]);
  return <div className="modal-backdrop tableau-backdrop" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="tableau-preview" role="dialog" aria-modal="true" aria-labelledby="tableau-preview-title" ref={modalRef}>
      <div className="tableau-preview-head"><div><span>TABLEAU PUBLIC / INTERACTIVE PREVIEW</span><h3 id="tableau-preview-title">{viz.title}</h3></div><button type="button" className="modal-close" ref={closeRef} onClick={onClose} aria-label="Close Tableau preview"><X size={19}/></button></div>
      <div className="tableau-frame"><iframe src={viz.embedUrl} title={'Interactive Tableau dashboard '+viz.title} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>
      <div className="tableau-preview-foot"><p>If Tableau blocks embedded viewing, open the original dashboard.</p><a className="button button-primary" href={viz.url} target="_blank" rel="noopener noreferrer">Open on Tableau <ArrowUpRight size={16}/></a></div>
    </div>
  </div>;
}

function TableauGallery() {
  const [items,setItems]=useState([]);
  const [status,setStatus]=useState('loading');
  const [search,setSearch]=useState('');
  const [sort,setSort]=useState('recent');
  const [expanded,setExpanded]=useState(false);
  const [preview,setPreview]=useState(null);
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/tableau',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Unavailable');return r.json();})
      .then(data=>{if(!Array.isArray(data.workbooks))throw new Error('Unexpected response');setItems(data.workbooks);setStatus('ready');})
      .catch(e=>{if(e.name!=='AbortError')setStatus('unavailable');});
    return()=>controller.abort();
  },[]);
  const matching=useMemo(()=>{
    const q=search.trim().toLowerCase();
    const result=items.filter(v=>!q || (v.title+' '+(v.description||'')).toLowerCase().includes(q));
    if(sort==='popular')result.sort((a,b)=>(b.views??-1)-(a.views??-1));
    else if(sort==='title')result.sort((a,b)=>a.title.localeCompare(b.title));
    else result.sort((a,b)=>String(b.published||b.updated||'').localeCompare(String(a.published||a.updated||'')));
    return result;
  },[items,search,sort]);
  const visible=expanded || search ? matching : matching.slice(0,6);
  return <section className="section tableau-section" id="tableau"><div className="shell">
    <div className="tableau-heading" data-reveal>
      <div><div className="section-index"><span>02</span> / TABLEAU PUBLIC</div><span className="tableau-label">PUBLISHED DATA VISUALIZATIONS</span><h2>Visual stories.<br/><em>Made interactive.</em></h2></div>
      <div className="tableau-heading-aside"><p>A collection of my published Tableau work. Explore the visualizations here, or view the full interactive experience on Tableau Public.</p><a href={TABLEAU_URL} target="_blank" rel="noopener noreferrer">Explore my Tableau profile <ArrowUpRight size={17}/></a></div>
    </div>
    {status==='loading' && <div className="tableau-status"><span className="tableau-live-dot"/> CONNECTING TO TABLEAU PUBLIC<div className="tableau-grid">{[1,2,3].map(n=><div key={n} className="tableau-skeleton"/>)}</div></div>}
    {(status==='unavailable' || (status==='ready' && items.length===0)) && <div className="tableau-empty"><BarChart3 size={33}/><h3>Explore the Tableau collection</h3><p>{status==='unavailable'?'The live gallery is unavailable right now. Open my Tableau Public profile to explore the published visualizations.':'The Tableau API did not return any visible workbooks. Check my profile for the latest published projects.'}</p><a className="button button-primary" target="_blank" rel="noopener noreferrer" href={TABLEAU_URL}>Visit Tableau Public <ArrowUpRight size={17}/></a></div>}
    {status==='ready' && items.length>0 && <>
      <div className="tableau-controls"><div className="tableau-count"><span className="tableau-live-dot"/><strong>{items.length.toString().padStart(2,'0')}</strong> PUBLISHED VIZZES</div><div className="tableau-form"><label><Search size={16}/><input value={search} type="search" placeholder="Search Tableau dashboards" aria-label="Search Tableau dashboards" onChange={e=>{setSearch(e.target.value);setExpanded(false);}}/></label><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort Tableau visualizations"><option value="recent">Newest first</option><option value="popular">Most viewed</option><option value="title">A to Z</option></select></div></div>
      {matching.length ? <div className="tableau-grid">{visible.map(v=><TableauCard key={v.id} viz={v} onPreview={setPreview}/>)}</div> : <div className="tableau-empty"><Search size={25}/><h3>No matching visualizations</h3><button className="tableau-clear" onClick={()=>setSearch('')}>Clear search <ArrowRight size={15}/></button></div>}
      {!expanded && !search && matching.length>visible.length && <div className="tableau-more"><button className="button button-outline" onClick={()=>setExpanded(true)}>Show all {matching.length} visualizations <ArrowDown size={16}/></button></div>}
      <div className="tableau-end"><span>THUMBNAILS & WORKBOOK DETAILS FROM TABLEAU PUBLIC</span></div>
    </>}
    {preview && <TableauPreview viz={preview} onClose={()=>setPreview(null)}/>}
  </div></section>;
}

function Expertise() {
  const [active, setActive] = useState(0);
  return <section className="section expertise-section" id="expertise"><div className="shell"><div className="section-heading expertise-heading" data-reveal><div><div className="section-index"><span>03</span> / TOOLKIT & THINKING</div><h2>Data thinking.<br /><em>Product mindset.</em></h2></div><p className="section-intro-small">A practical mix of analytical thinking, technical development and visual communication.</p></div>
    <div className="expertise-layout"><div className="expertise-tabs" role="tablist" aria-label="Explore skill groups">{skillGroups.map((group, index) => <button key={group.title} role="tab" id={'skill-tab-' + index} aria-selected={active === index} aria-controls="skill-panel" className={'expertise-tab' + (active === index ? ' active' : '')} onClick={() => setActive(index)}><span>{group.marker} / {group.title}</span><ArrowUpRight size={20} /></button>)}</div><div className="expertise-detail" id="skill-panel" role="tabpanel" aria-labelledby={'skill-tab-' + active} key={active}><div className="detail-kicker"><span className="detail-kicker-dot" /> MY TOOLKIT / {skillGroups[active].marker}</div><h3>{skillGroups[active].intro}</h3><p>{skillGroups[active].detail}</p><div className="skills-tags">{skillGroups[active].tools.map((tool) => <span key={tool}>{tool}<span className="skill-indicator">↗</span></span>)}</div><div className="skills-footer"><span>BUILDING THROUGH PRACTICE</span><span>0{active + 1} / 03</span></div></div></div>
  </div></section>;
}

function Approach() {
  const steps = [
    { n: '01', title: 'Ask better questions', description: 'Frame the business problem, define what a useful answer looks like and identify the right metrics.', icon: Search },
    { n: '02', title: 'Make data dependable', description: 'Structure, inspect and validate the dataset before building conclusions on top of it.', icon: Database },
    { n: '03', title: 'Find the signal', description: 'Use SQL, Python and focused exploration to separate useful patterns from background noise.', icon: Activity },
    { n: '04', title: 'Communicate clearly', description: 'Turn findings into accessible visualizations and next-step recommendations people can use.', icon: Layers3 },
  ];
  return <section className="section approach-section" id="approach"><div className="shell"><div className="approach-header" data-reveal><div><div className="section-index"><span>04</span> / HOW I APPROACH DATA</div><h2>Beyond the<br /><em>dashboard.</em></h2></div><p>Good analytics is not the number of charts you make. It is the quality of the questions you can help answer.</p></div><div className="approach-grid">{steps.map((step) => <div className="approach-item" key={step.n}><div className="approach-number">{step.n}<step.icon size={20} strokeWidth={1.6} /></div><h3>{step.title}</h3><p>{step.description}</p><span className="approach-bottom-line" /></div>)}</div></div></section>;
}

function About() {
  return <section className="section about-section" id="about"><div className="shell about-layout"><div className="about-graphic" data-reveal><div className="about-graphic-grid" /><div className="about-graphic-top">A WORK IN PROGRESS <span>↗</span></div><div className="about-monogram">JP<span>.</span></div><div className="about-graphic-bottom"><span>LEARN / BUILD / REFINE</span><span>PH · 2026</span></div><span className="orbit-circle orbit-a" /><span className="orbit-circle orbit-b" /></div><div className="about-copy" data-reveal><div className="section-index"><span>05</span> / A BIT ABOUT ME</div><h2>Curiosity is<br /><em>the starting point.</em></h2><p>I'm John Paul Torres, an aspiring data analytics professional based in the Philippines. I am interested in the space where data, design and decision-making intersect.</p><p>My projects span business intelligence dashboards, relational analysis, location-aware logistics tools and data applications. I enjoy both the analytical work behind the numbers and the challenge of making those numbers easy to understand.</p><div className="about-values"><span><Check size={15} /> Business-first questions</span><span><Check size={15} /> Reproducible workflows</span><span><Check size={15} /> Thoughtful visual design</span></div></div></div></section>;
}

function Contact() {
  const channels = [
    { label: 'Email', detail: profile.email, href: `mailto:${profile.email}`, icon: Mail, external: false },
    { label: 'LinkedIn', detail: 'Professional network', href: profile.linkedin, icon: Linkedin, external: true },
    { label: 'Tableau Public', detail: 'Interactive visualizations', href: profile.tableau, icon: BarChart3, external: true },
    { label: 'GitHub', detail: 'Source code & projects', href: profile.github, icon: Github, external: true },
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="shell">
        <div className="contact-inner">
          <div className="contact-topline"><span><span className="contact-pulse" /> LET'S BUILD SOMETHING MEANINGFUL</span><span>06 / CONNECT</span></div>
          <h2>Have a question<br />worth <em>exploring?</em></h2>
          <p>I'm always interested in learning, thoughtful collaborations and opportunities to work on meaningful data problems.</p>
          <div className="contact-channels-label">CONNECT ON</div>
          <div className="contact-links" aria-label="Ways to connect">
            {channels.map(({ label, detail, href, icon: Icon, external }) => (
              <a key={label} className="contact-link" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={`Connect on ${label}`}>
                <span className="contact-link-icon"><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="contact-link-copy"><strong>{label}</strong><small>{detail}</small></span>
                <ArrowUpRight size={17} strokeWidth={1.8} className="contact-link-arrow" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="contact-decoration" aria-hidden="true">↗</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><div className="shell footer-row"><Brand /><p>SQL · Python · Tableau · Data storytelling.</p><div className="footer-right"><span>© {new Date().getFullYear()} JOHN PAUL TORRES</span></div></div></footer>;
}

function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!project) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = Array.from(dialogRef.current?.querySelectorAll('a[href], button:not([disabled])') || []);
      if (!elements.length) return;
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, [project, onClose]);
  if (!project) return null;
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className={'project-modal accent-' + project.accent} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
    <div className="modal-nav"><span className="modal-ident"><span className="modal-dot" /> CASE STUDY / {project.number}</span><button className="modal-close" type="button" onClick={onClose} ref={closeRef} aria-label="Close case study"><X size={20} /></button></div>
    <div className="modal-scroll"><div className="modal-cover"><ProjectArtwork project={project} /></div><div className="modal-content"><div className="modal-category">{project.domain} <span>·</span> {project.category}</div><h2 id="modal-title">{project.title}</h2><p className="modal-lead">{project.description}</p><div className="modal-columns"><div className="modal-field"><div className="modal-field-name">THE QUESTION</div><p>{project.question}</p></div><div className="modal-field"><div className="modal-field-name">THE APPROACH</div><p>{project.approach}</p></div></div><div className="modal-field modal-takeaways"><div className="modal-field-name">WHAT THIS DEMONSTRATES</div><ul>{project.takeaways.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div>{project.image && <div className="modal-real-preview"><div className="modal-field-name">SOURCE REPOSITORY VISUAL <span>· ACTUAL PROJECT ASSET</span></div><a href={project.image} target="_blank" rel="noreferrer"><img src={project.image} alt={'Chart or screenshot from ' + project.title + ' repository'} loading="lazy" /><span>Open original image <ExternalLink size={14} /></span></a></div>}<div className="modal-dataset"><CircleDataIcon /><p>{project.data}</p></div><div className="modal-tech">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="button button-primary modal-repo" href={project.link} target="_blank" rel="noreferrer">View source on GitHub <ArrowUpRight size={18} /></a></div></div>
  </div></div>;
}

function CircleDataIcon() { return <Database size={19} aria-hidden="true" />; }

function CommandPalette({ onClose, onOpen }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const results = useMemo(() => projects.filter((project) => [project.title, project.description, project.domain, ...project.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7), [query]);
  useEffect(() => {
    const lastFocus = document.activeElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => { document.body.style.overflow = priorOverflow; lastFocus?.focus?.(); };
  }, []);
  useEffect(() => { setActive(0); }, [query]);
  const select = (project) => { onClose(); onOpen(project); };
  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(index + 1, results.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(0, index - 1)); }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); select(results[active]); }
    if (event.key === 'Tab') { event.preventDefault(); inputRef.current?.focus(); }
  };
  return <div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="command-box" role="dialog" aria-modal="true" aria-label="Find projects" ref={containerRef} onKeyDown={onKeyDown}><div className="command-input-wrap"><Search size={21} /><input ref={inputRef} type="search" placeholder="Search projects, tools, topics..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search all projects" /><button onClick={onClose} aria-label="Close search"><X size={17} /></button></div><div className="command-section-label">{query ? 'MATCHING PROJECTS' : 'QUICKLY EXPLORE'}</div><div className="command-results">{results.length ? results.map((project, index) => <button key={project.id} className={'command-result' + (active === index ? ' active' : '')} onMouseEnter={() => setActive(index)} onClick={() => select(project)}><span className={'command-result-icon accent-' + project.accent}><BarChart3 size={17} /></span><span className="command-result-text"><strong>{project.title}</strong><small>{project.domain} · {project.tags.slice(0, 2).join(', ')}</small></span><ArrowUpRight size={15} /></button>) : <div className="command-no-results">No projects found. Try “SQL”, “dashboard” or “logistics”.</div>}</div><div className="command-foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>ESC</kbd> Close</span></div></div></div>;
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [selected, setSelected] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  useReveal();
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (!selected) setCommandOpen((value) => !value); }
      if (event.key === '/' && !selected && !commandOpen && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { event.preventDefault(); document.querySelector('.project-search input')?.focus(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selected, commandOpen]);
  return <>
    <a href="#work" className="skip-link">Skip to projects</a>
    <Header theme={theme} toggleTheme={toggleTheme} onSearch={() => setCommandOpen(true)} />
    <main><Hero /><div className="ticker-bar" aria-hidden="true"><div className="shell ticker-content"><span>PYTHON <i>✳</i> SQL <i>✳</i> BUSINESS INTELLIGENCE <i>✳</i> DATA VISUALIZATION <i>✳</i> GEOSPATIAL ANALYTICS <i>✳</i> DATA PRODUCTS</span></div></div><Work onOpen={setSelected} /><TableauGallery /><Expertise /><Approach /><About /><Contact /></main>
    <Footer />
    {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} onOpen={setSelected} />}
  </>;
}
