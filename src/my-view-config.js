import { featureFilters } from './feature-filters';

const DATA_BASE_URL = process.env.REACT_APP_DATA_BASE_URL || 'https://heart-atlas.s3.us-east-2.amazonaws.com';
const dataUrl = (path) => `${DATA_BASE_URL}${path}`;

const P7_CELL_TYPES = [
  'Ankrd1.CM',
  'Blood',
  'Col8a1.Fib',
  'Ddc.CM',
  'Epic',
  'Gfpt2.Fib',
  'Neur',
  'Peri',
  'Postn.Fib',
  'SMC',
  'Slit2.CM',
  'a.CM',
  'arteriole.EC',
  'av.CM',
  'cap.EC',
  'cap.EC.High.Myo.',
  'endocardial.EC',
  'p.CM',
  'p.EC',
  'p.Fib',
  'v.CM',
  'valve.Fib',
];

const hasFeature = (value) => (
  featureFilters.genes.includes(value)
  || featureFilters.tf.includes(value)
  || featureFilters.cc.includes(value)
);

const urlSelection = () => {
  if (typeof window === 'undefined') {
    return { feature: '', cellType: '' };
  }

  const params = new URLSearchParams(window.location.search);
  const feature = params.get('feature') || '';
  const cellType = params.get('cellType') || '';

  return {
    feature: hasFeature(feature) ? feature : '',
    cellType: P7_CELL_TYPES.includes(cellType) ? cellType : '',
  };
};

const withUrlSelection = (config) => {
  const { feature, cellType } = urlSelection();
  if (!feature && !cellType) {
    return config;
  }

  const selectedScopesForComponent = (component) => {
    const featureScopes = feature ? {
      featureSelection: 'urlFeature',
      obsColorEncoding: 'urlFeature',
      ...(['spatial', 'scatterplot'].includes(component) ? {
        featureValueColormap: 'urlFeature',
        featureValueColormapRange: 'urlFeature',
      } : {}),
    } : {};

    return {
      ...featureScopes,
      ...(cellType ? { obsSetSelection: 'urlCellType' } : {}),
    };
  };

  return {
    ...config,
    uid: `p7-${feature || 'all'}-${cellType || 'all'}`,
    coordinationSpace: {
      ...config.coordinationSpace,
      ...(feature ? {
        featureSelection: {
          urlFeature: [feature],
        },
        obsColorEncoding: {
          urlFeature: 'geneSelection',
        },
        featureValueColormap: {
          urlFeature: 'plasma',
        },
        featureValueColormapRange: {
          urlFeature: [0, 1],
        },
      } : {}),
      ...(cellType ? {
        obsSetSelection: {
          urlCellType: [
            [
              'Cytospace.final.anno',
              cellType,
            ],
          ],
        },
      } : {}),
    },
    layout: config.layout.map((view) => {
      if (!['spatial', 'scatterplot', 'featureList', 'obsSets'].includes(view.component)) {
        return view;
      }

      return {
        ...view,
        coordinationScopes: {
          ...view.coordinationScopes,
          ...selectedScopesForComponent(view.component),
        },
      };
    }),
  };
};

const baseViewConfig = {
  "version": "1.0.15",
  "name": "Heart Xenium Dataset P7",
  "description": "",
  "datasets": [
    {
      "uid": "xenium",
      "name": "xenium",
      "files": [
        {
          "fileType": "raster.json",
          "options": {
            "renderLayers": [
              "heart-xenium-raw",
              "heart-xenium-label"
            ],
            "schemaVersion": "0.0.2",
            "images": [
              {
                "name": "heart-xenium-raw",
                "url": dataUrl("/p7/heart-xenium-raw.zarr/"),
                "type": "zarr",
                "metadata": {
                  "isBitmask": false,
                  "dimensions": [
                    {
                      "field": "t",
                      "type": "quantitative",
                      "values": null
                    },
                    {
                      "field": "channel",
                      "type": "nominal",
                      "values": [
                      ]
                    },
                    {
                      "field": "y",
                      "type": "quantitative",
                      "values": null
                    },
                    {
                      "field": "x",
                      "type": "quantitative",
                      "values": null
                    }
                  ],
                  "isPyramid": true,
                  "transform": {
                    "translate": {
                      "y": 0,
                      "x": 0
                    },
                    "scale": 1
                  }
                }
              },
              {
                "name": "heart-xenium-label",
                "url": dataUrl("/p7/heart-xenium-label.zarr/"),
                "type": "zarr",
                "metadata": {
                  "isBitmask": true,
                  "dimensions": [
                    {
                      "field": "t",
                      "type": "quantitative",
                      "values": null
                    },
                    {
                      "field": "channel",
                      "type": "nominal",
                      "values": [
                        "Labels"
                      ]
                    },
                    {
                      "field": "y",
                      "type": "quantitative",
                      "values": null
                    },
                    {
                      "field": "x",
                      "type": "quantitative",
                      "values": null
                    }
                  ],
                  "isPyramid": true,
                  "transform": {
                    "translate": {
                      "y": 0,
                      "x": 0
                    },
                    "scale": 1
                  }
                }
              }
            ]
          }
        },
        {
          "fileType": "anndata.zarr",
          "url": dataUrl("/p7/heart-xenium-anndata.zarr/"),
          "options": {
            "obsLocations": {
              "path": "obsm/X_spatial"
            },
            "obsEmbedding": [
              {
                "path": "obsm/X_umap",
                "embeddingType": "X_UMAP",
                "dims": [
                  0,
                  1
                ]
              },
              {
                "path": "obsm/X_pca",
                "embeddingType": "X_PCA",
                "dims": [
                  0,
                  1
                ]
              }
            ],
            "obsSets": [
              {
                "name": "Cytospace.final.anno",
                "path": "obs/cytoSPACE.final.anno"
              }
            ],
            "obsFeatureMatrix": {
              "path": "X"
            }
          }
        }
      ]
    }
  ],
  "coordinationSpace": {
    "dataset": {
      "A": "xenium"
    },
    "embeddingType": {
      "X_UMAP": "X_UMAP",
      "X_PCA": "X_PCA"
    },
    "featureFilter": {
      "genes": featureFilters.genes,
      "cc": featureFilters.cc,
      "tf": featureFilters.tf
    },
    "obsSetExpansion": {
      "cellTypes": [
        [
          "Cytospace.final.anno"
        ]
      ]
    }
  },
  "layout": [
    {
      "component": "spatial",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 0,
      "y": 0,
      "w": 6,
      "h": 12
    },
    {
      "component": "scatterplot",
      "coordinationScopes": {
        "dataset": "A",
        "embeddingType": "X_UMAP"
      },
      "props": {
        "title": "UMAP",
        "helpText": "It displays two-dimensional (pre-computed) dimensionality reduction results (UMAP). Each point on the scatterplot represents a cell with a matched location on the spatial view. Cell type colors are shown in the Cell Types / Legend panel."
      },
      "x": 6,
      "y": 0,
      "w": 3,
      "h": 6
    },
    {
      "component": "obsSets",
      "coordinationScopes": {
        "dataset": "A",
        "obsSetExpansion": "cellTypes"
      },
      "props": {
        "title": "Cell Types / Legend",
        "helpText": "The color swatches label the cell types shown in the UMAP and spatial views. Use the checkboxes to show or hide cell types."
      },
      "x": 6,
      "y": 6,
      "w": 3,
      "h": 6
    },
    {
      "component": "featureList",
      "coordinationScopes": {
        "dataset": "A",
        "featureFilter": "genes"
      },
      "props": {
        "title": "Gene List",
        "helpText": "The list displays genes included in postnatal heart."
      },
      "x": 9,
      "y": 0,
      "w": 3,
      "h": 4
    },
    {
      "component": "featureList",
      "coordinationScopes": {
        "dataset": "A",
        "featureFilter": "cc"
      },
      "props": {
        "title": "Cell Communication List",
        "helpText": "The list displays ligand-receptor pairs (both direct and indirect communication) included in postnatal heart."
      },
      "x": 9,
      "y": 4,
      "w": 3,
      "h": 4
    },
    {
      "component": "featureList",
      "coordinationScopes": {
        "dataset": "A",
        "featureFilter": "tf"
      },
      "props": {
        "title": "TF List",
        "helpText": "The list displays transcription factors included in postnatal heart."
      },
      "x": 9,
      "y": 8,
      "w": 3,
      "h": 4
    }
  ],
  "initStrategy": "auto"
};

export const myViewConfig = withUrlSelection(baseViewConfig);
