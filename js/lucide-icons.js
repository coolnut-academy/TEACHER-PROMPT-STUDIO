/**
 * Teacher Prompt Studio — Local Lucide Icon Set (MIT-style 24x24 Stroke Icons)
 *
 * Self-contained icon renderer compatible with offline local files and GitHub Pages
 * without external CDN requests or raw HTML string injection.
 */
(function (root) {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const ICON_NODES = {
    'book-open': [
      ['path', { d: 'M12 7v14' }],
      ['path', { d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' }]
    ],
    'file-text': [
      ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
      ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }],
      ['path', { d: 'M10 9H8' }],
      ['path', { d: 'M16 13H8' }],
      ['path', { d: 'M16 17H8' }]
    ],
    'rotate-ccw': [
      ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
      ['path', { d: 'M3 3v5h5' }]
    ],
    'sparkles': [
      ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
      ['path', { d: 'M20 3v4' }],
      ['path', { d: 'M22 5h-4' }],
      ['path', { d: 'M4 17v2' }],
      ['path', { d: 'M5 18H3' }]
    ],
    'graduation-cap': [
      ['path', { d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z' }],
      ['path', { d: 'M22 10v6' }],
      ['path', { d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5' }]
    ],
    'sliders-horizontal': [
      ['line', { x1: '21', x2: '14', y1: '4', y2: '4' }],
      ['line', { x1: '10', x2: '3', y1: '4', y2: '4' }],
      ['line', { x1: '21', x2: '12', y1: '12', y2: '12' }],
      ['line', { x1: '8', x2: '3', y1: '12', y2: '12' }],
      ['line', { x1: '21', x2: '16', y1: '20', y2: '20' }],
      ['line', { x1: '12', x2: '3', y1: '20', y2: '20' }],
      ['line', { x1: '14', x2: '14', y1: '2', y2: '6' }],
      ['line', { x1: '8', x2: '8', y1: '10', y2: '14' }],
      ['line', { x1: '16', x2: '16', y1: '18', y2: '22' }]
    ],
    'copy': [
      ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
      ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]
    ],
    'check': [
      ['path', { d: 'M20 6 9 17l-5-5' }]
    ],
    'download': [
      ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
      ['polyline', { points: '7 10 12 15 17 10' }],
      ['line', { x1: '12', x2: '12', y1: '15', y2: '3' }]
    ],
    'arrow-right': [
      ['path', { d: 'M5 12h14' }],
      ['path', { d: 'm12 5 7 7-7 7' }]
    ],
    'arrow-left': [
      ['path', { d: 'm12 19-7-7 7-7' }],
      ['path', { d: 'M19 12H5' }]
    ],
    'eye': [
      ['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }],
      ['circle', { cx: '12', cy: '12', r: '3' }]
    ],
    'alert-triangle': [
      ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }],
      ['path', { d: 'M12 9v4' }],
      ['path', { d: 'M12 17h.01' }]
    ],
    'info': [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['path', { d: 'M12 16v-4' }],
      ['path', { d: 'M12 8h.01' }]
    ],
    'x': [
      ['path', { d: 'M18 6 6 18' }],
      ['path', { d: 'm6 6 12 12' }]
    ],
    'list-checks': [
      ['path', { d: 'm3 17 2 2 4-4' }],
      ['path', { d: 'm3 7 2 2 4-4' }],
      ['path', { d: 'M13 6h8' }],
      ['path', { d: 'M13 12h8' }],
      ['path', { d: 'M13 18h8' }]
    ],
    'message-square-text': [
      ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
      ['path', { d: 'M13 8H7' }],
      ['path', { d: 'M17 12H7' }]
    ],
    'text-cursor-input': [
      ['path', { d: 'M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1' }],
      ['path', { d: 'M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5' }],
      ['path', { d: 'M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1' }],
      ['path', { d: 'M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7' }],
      ['path', { d: 'M9 7v10' }]
    ],
    'calculator': [
      ['rect', { width: '16', height: '20', x: '4', y: '2', rx: '2' }],
      ['line', { x1: '8', x2: '16', y1: '6', y2: '6' }],
      ['line', { x1: '16', x2: '16', y1: '14', y2: '18' }],
      ['path', { d: 'M16 10h.01' }],
      ['path', { d: 'M12 10h.01' }],
      ['path', { d: 'M8 10h.01' }],
      ['path', { d: 'M12 14h.01' }],
      ['path', { d: 'M8 14h.01' }],
      ['path', { d: 'M12 18h.01' }],
      ['path', { d: 'M8 18h.01' }]
    ],
    'compass': [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['polygon', { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' }]
    ],
    'folder-search': [
      ['path', { d: 'M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1' }],
      ['path', { d: 'm21 21-1.9-1.9' }],
      ['circle', { cx: '17', cy: '17', r: '3' }]
    ],
    'mouse-pointer-click': [
      ['path', { d: 'M14 4.1 12 6' }],
      ['path', { d: 'm5.1 8-2.9-.8' }],
      ['path', { d: 'm6 12-1.9 2' }],
      ['path', { d: 'M7.2 2.2 8 5.1' }],
      ['path', { d: 'M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z' }]
    ],
    'layers': [
      ['path', { d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }],
      ['path', { d: 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' }],
      ['path', { d: 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' }]
    ],
    'wand-2': [
      ['path', { d: 'm21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72' }],
      ['path', { d: 'm14 7 3 3' }],
      ['path', { d: 'M5 6v4' }],
      ['path', { d: 'M19 14v4' }],
      ['path', { d: 'M10 2v2' }],
      ['path', { d: 'M7 8H3' }],
      ['path', { d: 'M21 16h-4' }],
      ['path', { d: 'M11 3H9' }]
    ],
    'chevron-down': [
      ['path', { d: 'm6 9 6 6 6-6' }]
    ],
    'pencil': [
      ['path', { d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' }],
      ['path', { d: 'm15 5 4 4' }]
    ],
    'shield-check': [
      ['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }],
      ['path', { d: 'm9 12 2 2 4-4' }]
    ],
    'menu': [
      ['line', { x1: '4', x2: '20', y1: '12', y2: '12' }],
      ['line', { x1: '4', x2: '20', y1: '6', y2: '6' }],
      ['line', { x1: '4', x2: '20', y1: '18', y2: '18' }]
    ],
    'help-circle': [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }],
      ['path', { d: 'M12 17h.01' }]
    ],
    'sliders': [
      ['line', { x1: '4', x2: '4', y1: '21', y2: '14' }],
      ['line', { x1: '4', x2: '4', y1: '10', y2: '3' }],
      ['line', { x1: '12', x2: '12', y1: '21', y2: '12' }],
      ['line', { x1: '12', x2: '12', y1: '8', y2: '3' }],
      ['line', { x1: '20', x2: '20', y1: '21', y2: '16' }],
      ['line', { x1: '20', x2: '20', y1: '12', y2: '3' }],
      ['line', { x1: '2', x2: '6', y1: '14', y2: '14' }],
      ['line', { x1: '10', x2: '14', y1: '8', y2: '8' }],
      ['line', { x1: '18', x2: '22', y1: '16', y2: '16' }]
    ]
  };

  function createIconSvg(name, extraClass) {
    const shapes = ICON_NODES[name];
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS);
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', `lucide lucide-${name}${extraClass ? ' ' + extraClass : ''}`);

    if (shapes) {
      shapes.forEach(([tag, attrs]) => {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs).forEach((key) => {
          node.setAttribute(key, attrs[key]);
        });
        svg.appendChild(node);
      });
    }

    return svg;
  }

  function hydrateIcons(scope) {
    const container = scope || document;
    const placeholders = container.querySelectorAll('[data-lucide]');
    placeholders.forEach((el) => {
      const iconName = el.getAttribute('data-lucide');
      if (!iconName) {
        return;
      }
      const svg = createIconSvg(iconName, el.className);
      if (el.parentNode) {
        el.parentNode.replaceChild(svg, el);
      }
    });
  }

  root.TPS = root.TPS || {};
  root.TPS.icons = {
    createIconSvg,
    hydrateIcons
  };
})(typeof window !== 'undefined' ? window : globalThis);
