export const THEME_PRESETS = {
  ivory: {
    id: 'ivory',
    label: 'Ivory',
    sceneBackground: '#f7efe1',
    sceneAccent: '#ece0c9',
    sceneGlow: '#f2c781',
    floorOpacity: 0.58,
    board: {
      light: '#f4ead8',
      dark: '#c7a46b',
      frame: '#b58a4a',
      apron: '#f7f0e2',
      pedestal: '#d5bc8d',
      hover: '#efd29d',
      lastMove: '#f0d8a7',
      selection: '#f6d798',
      marker: '#b88d49'
    },
    pieces: {
      w: {
        body: '#ffffff',
        accent: '#b88d49',
        emissive: '#5f4a1f'
      },
      b: {
        body: '#4a3b3b',
        accent: '#b88d49',
        emissive: '#61491d'
      }
    },
    clocks: {
      lightBody: '#f0e6d1',
      darkBody: '#000000'
    }
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    sceneBackground: '#05070d',
    sceneAccent: '#1e2841',
    sceneGlow: '#6a7cb0',
    floorOpacity: 0.46,
    board: {
      light: '#d5dced',
      dark: '#566898',
      frame: '#070b15',
      apron: '#05070d',
      pedestal: '#141c2f',
      hover: '#8ea2d6',
      lastMove: '#6b7fb6',
      selection: '#d8e2ff',
      marker: '#b99b5a'
    },
    pieces: {
      w: {
        body: '#eef2fb',
        accent: '#c9d7ff',
        emissive: '#b7c8f5'
      },
      b: {
        body: '#b89352',
        accent: '#f3d997',
        emissive: '#f2d28a'
      }
    },
    clocks: {
      lightBody: '#d8e4ff',
      darkBody: '#9b7741'
    }
  },
  regal: {
    id: 'regal',
    label: 'Regal',
    sceneBackground: '#101417',
    sceneAccent: '#243138',
    sceneGlow: '#d1a75f',
    floorOpacity: 0.5,
    board: {
      light: '#eee4cf',
      dark: '#90693c',
      frame: '#322111',
      apron: '#1a1f24',
      pedestal: '#314149',
      hover: '#f0d79e',
      lastMove: '#d7b778',
      selection: '#f3e1b9',
      marker: '#e0bb72'
    },
    pieces: {
      w: {
        body: '#f4ead7',
        accent: '#c59751',
        emissive: '#745323'
      },
      b: {
        body: '#0077ff',
        accent: '#d1a75f',
        emissive: '#9f7a3b'
      }
    },
    clocks: {
      lightBody: '#ead9b5',
      darkBody: '#263038'
    }
  }
};

export const DEFAULT_THEME_ID = 'ivory';
