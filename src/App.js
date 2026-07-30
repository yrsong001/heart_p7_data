import React, { useEffect } from 'react';
import { Vitessce } from 'vitessce';
import { featureFilters } from './feature-filters';
import { myViewConfig } from './my-view-config';

const itemCount = (items) => `${items.length.toLocaleString()} items`;

const featureListInfoByTitle = {
  'Gene List': itemCount(featureFilters.genes),
  'Cell Communication List': itemCount(featureFilters.cc),
  'TF List': itemCount(featureFilters.tf),
};

const stageLabel = myViewConfig.name.match(/P\d+/i)?.[0].toUpperCase() || 'P7';

const hasUrlSelection = () => {
  const params = new URLSearchParams(window.location.search);
  return Boolean(params.get('feature') || params.get('cellType'));
};

const fullAtlasHref = () => `${window.location.origin}${window.location.pathname}`;

function useWebatlasUiTweaks() {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return undefined;
    }

    const selectionActive = hasUrlSelection();
    let didHandleCellTypesExpansion = false;

    const applyTweaks = () => {
      document.querySelectorAll('[role="banner"]').forEach((banner) => {
        const title = banner.querySelector('[role="heading"]')?.textContent?.trim();
        const info = featureListInfoByTitle[title];
        const note = banner.querySelector('[role="note"]');
        if (info && note && note.textContent !== info) {
          note.textContent = info;
          note.setAttribute('title', info);
        }
      });

      document.querySelectorAll('svg[width="100"][height="36"]').forEach((legendSvg) => {
        legendSvg.parentElement?.classList.add('webatlas-feature-legend-lg');
      });

      if (selectionActive) {
        const spatialBanner = Array.from(document.querySelectorAll('[role="banner"]'))
          .find(banner => banner.querySelector('[role="heading"]')?.textContent?.includes('Xenium spatial'));
        const toolbar = spatialBanner?.querySelector('[role="toolbar"]');
        if (toolbar && !toolbar.querySelector('.webatlas-full-atlas-link')) {
          const link = document.createElement('a');
          link.className = 'webatlas-full-atlas-link';
          link.href = fullAtlasHref();
          link.textContent = `Full ${stageLabel} atlas`;
          link.title = `Clear selected feature/cell type and return to the full ${stageLabel} atlas`;
          link.setAttribute('aria-label', link.title);
          toolbar.prepend(link);
        }
      }

      if (!didHandleCellTypesExpansion) {
        const cellTypeButton = Array.from(document.querySelectorAll('button'))
          .find(button => button.textContent.trim() === 'Cytospace.final.anno');
        if (cellTypeButton) {
          const closedSwitcher = cellTypeButton
            .closest('.rc-tree-treenode')
            ?.querySelector('.rc-tree-switcher_close');
          if (closedSwitcher instanceof HTMLElement) {
            closedSwitcher.click();
          }
          didHandleCellTypesExpansion = true;
        }
      }
    };

    applyTweaks();

    const observer = new MutationObserver(applyTweaks);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);
}

export default function App() {
  useWebatlasUiTweaks();

  return (
    <Vitessce
      config={myViewConfig}
      theme="light"
    />
  );
}
