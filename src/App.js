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
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const cellTypeNodes = () => Array.from(document.querySelectorAll('.rc-tree-treenode.level-1-treenode'));
const clickCellTypeCheckbox = (checkbox) => {
  ['mousedown', 'mouseup', 'click'].forEach((type) => {
    checkbox.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
  });
};

const setCellTypeSelection = async (shouldSelect) => {
  let guard = 0;
  while (guard < 80) {
    const node = cellTypeNodes().find((item) => {
      const checkbox = item.querySelector('.rc-tree-checkbox');
      return checkbox && checkbox.classList.contains('rc-tree-checkbox-checked') !== shouldSelect;
    });
    const checkbox = node?.querySelector('.rc-tree-checkbox');
    if (!(checkbox instanceof HTMLElement)) {
      break;
    }
    clickCellTypeCheckbox(checkbox);
    guard += 1;
    await sleep(80);
  }
};

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
          link.textContent = 'Clear selection';
          link.title = `Clear selected gene/TF/CC or cell type and return to the full ${stageLabel} atlas`;
          link.setAttribute('aria-label', link.title);
          toolbar.prepend(link);
        }
      }

      const cellTypesBanner = Array.from(document.querySelectorAll('[role="banner"]'))
        .find(banner => banner.querySelector('[role="heading"]')?.textContent?.includes('Cell Types / Legend'));
      const cellTypesToolbar = cellTypesBanner?.querySelector('[role="toolbar"]');
      if (cellTypesToolbar && !cellTypesToolbar.querySelector('.webatlas-cell-type-actions')) {
        const actions = document.createElement('span');
        actions.className = 'webatlas-cell-type-actions';
        [
          ['Select all', true],
          ['Deselect all', false],
        ].forEach(([label, shouldSelect]) => {
          const button = document.createElement('button');
          button.className = 'webatlas-cell-type-action';
          button.type = 'button';
          button.textContent = label;
          button.addEventListener('click', () => setCellTypeSelection(shouldSelect));
          actions.append(button);
        });
        cellTypesToolbar.prepend(actions);
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
