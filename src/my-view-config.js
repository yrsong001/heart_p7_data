export const myViewConfig = {
  "version": "1.0.15",
  "name": "Heart Xenium Dataset P0",
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
                "url": "https://heart-atlas-p0-test.s3.us-east-2.amazonaws.com/p0/heart-xenium-raw.zarr/",
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
                "url": "https://heart-atlas-p0-test.s3.us-east-2.amazonaws.com/p0/heart-xenium-label.zarr/",
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
          "url": "https://heart-atlas-p0-test.s3.us-east-2.amazonaws.com/p0/heart-xenium-anndata.zarr/",
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
    }
  },
  "layout": [
    {
      "component": "layerController",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 0,
      "y": 0,
      "w": 3,
      "h": 12
    },
    {
      "component": "spatial",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 3,
      "y": 0,
      "w": 3,
      "h": 12
    },
    {
      "component": "scatterplot",
      "coordinationScopes": {
        "dataset": "A",
        "embeddingType": "X_UMAP"
      },
      "x": 6,
      "y": 0,
      "w": 3,
      "h": 6
    },
    {
      "component": "obsSets",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 6,
      "y": 6,
      "w": 3,
      "h": 6
    },
    {
      "component": "featureList",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 9,
      "y": 0,
      "w": 3,
      "h": 12
    }
  ],
  "initStrategy": "auto"
};