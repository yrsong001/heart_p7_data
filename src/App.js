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

function useWebatlasUiTweaks() {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return undefined;
    }

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
