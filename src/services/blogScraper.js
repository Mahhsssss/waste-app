export const fetchScrapImpactBlogs = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=recycling+waste+pollution+hazard&hl=en-US&gl=US&ceid=US:en',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data && data.status === 'ok' && data.items && data.items.length > 0) {
      return data.items.map((item, index) => ({
        id: `live-${index}`,
        title: item.title,
        source: item.author || 'Eco Watch',
        link: item.link,
        date: new Date(item.pubDate).toLocaleDateString(),
        snippet: item.description.replace(/<[^>]*>?/gm, '').slice(0, 110) + '...',
        category: getScrapCategory(item.title),
        urgency: index % 2 === 0 ? 'HIGH HAZARD' : 'WARNING',
      }));
    }
    return getFallbackBlogs();
  } catch (error) {
    console.warn('Live API request skipped, loading curated category blogs:', error.message);
    return getFallbackBlogs();
  }
};

const getScrapCategory = (title) => {
  const t = title.toLowerCase();
  if (t.includes('paper') || t.includes('cardboard') || t.includes('deforestation')) return 'Paper & Cardboard';
  if (t.includes('plastic') || t.includes('microplastic') || t.includes('bottle')) return 'Plastics';
  if (t.includes('electronic') || t.includes('e-waste') || t.includes('battery') || t.includes('circuit')) return 'E-Waste';
  if (t.includes('metal') || t.includes('steel') || t.includes('aluminum') || t.includes('copper')) return 'Metals';
  if (t.includes('glass') || t.includes('cullet') || t.includes('silica')) return 'Glass';
  if (t.includes('textile') || t.includes('fabric') || t.includes('fashion') || t.includes('organic')) return 'Textiles & Organic Waste';
  return 'Hazardous Scrap';
};

const getFallbackBlogs = () => [
  {
    id: '1',
    title: 'Paper Waste & Deforestation: The Methane Crisis in Landfills',
    source: 'Forest Protection Alliance',
    link: 'https://www.epa.gov',
    date: 'Sep 2026',
    snippet: 'Decomposing paper produce high volumes of methane when buried without oxygen under landfill debris.',
    category: 'Paper & Cardboard',
    urgency: 'HIGH HAZARD',
    accentColor: '#8D6E63',
    icon: 'document-text-outline',
  },
  {
    id: '2',
    title: 'Microplastics In Drinking Water & Agricultural Soils',
    source: 'Global Eco Science',
    link: 'https://www.nature.com',
    date: 'Sep 2026',
    snippet: 'Non-recycled single-use plastics break down into toxic micro-particles swallowed by marine and land ecosystems.',
    category: 'Plastics',
    urgency: 'CRITICAL',
    accentColor: '#E65100',
    icon: 'trash-bin-outline',
  },
  {
    id: '3',
    title: 'Lithium Battery Explosions: The Thermal Landfill Hazard',
    source: 'Environmental Tech Watch',
    link: 'https://www.epa.gov/recycle/used-lithium-ion-batteries',
    date: 'Sep 2026',
    snippet: 'Improperly discarded phone and laptop batteries cause hundreds of dangerous thermal fires in scrap facilities.',
    category: 'E-Waste',
    urgency: 'CRITICAL',
    accentColor: '#D32F2F',
    icon: 'hardware-chip-outline',
  },
  {
    id: '4',
    title: 'Industrial Scrap Steel: The Hidden Carbon Footprint',
    source: 'Clean Energy Digest',
    link: 'https://www.sciencedirect.com',
    date: 'Aug 2026',
    snippet: 'Failing to melt and reuse scrap metal increases primary mining carbon emissions by over 60%.',
    category: 'Metals',
    urgency: 'MODERATE',
    accentColor: '#455A64',
    icon: 'build-outline',
  },
  {
    id: '5',
    title: 'Glass Containers in Landfills: 1 Million Years to Decompose',
    source: 'Zero Waste Council',
    link: 'https://www.gpi.org',
    date: 'Aug 2026',
    snippet: 'Glass is infinitely recyclable without loss of quality, yet millions of tons sit unused in city landfills.',
    category: 'Glass',
    urgency: 'WARNING',
    accentColor: '#00897B',
    icon: 'wine-outline',
  },
  {
    id: '6',
    title: 'Chemical Leaching from Acidic Industrial Scrap Containers',
    source: 'Hazardous Waste Institute',
    link: 'https://www.who.int',
    date: 'Aug 2026',
    snippet: 'Unregulated solvent and acid drum scrap contaminates local soil chemistry and nearby water tables.',
    category: 'Hazardous Scrap',
    urgency: 'CRITICAL',
    accentColor: '#C62828',
    icon: 'warning-outline',
  },
  {
    id: '7',
    title: 'Fast Fashion Textiles: Synthetic Microfibers in Oceans',
    source: 'Textile Recycle Lab',
    link: 'https://www.apparelcoalition.org',
    date: 'Jul 2026',
    snippet: 'Polyester and nylon clothing scrap shed billions of non-biodegradable synthetic threads into municipal waterways.',
    category: 'Textiles & Organic Waste',
    urgency: 'HIGH HAZARD',
    accentColor: '#6A1B9A',
    icon: 'shirt-outline',
  },
];