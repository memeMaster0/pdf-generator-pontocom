import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

export type TipoPolicarbonato = 'Compacto 3mm' | 'Alveolar 6mm' | null;
export type CorPolicarbonato =
  | 'Fumê'
  | 'Cinza refletivo'
  | 'Transparente'
  | 'Bronze'
  | 'Nenhuma'
  | null;
export type DimensaoTubo = '100 x 50' | '150 x 50' | 'Manual' | null;

export interface PergoladoFormData {
  tipoPolicarbonato: 'Compacto 3mm' | 'Alveolar 6mm';
  corPolicarbonato: 'Fumê' | 'Cinza refletivo' | 'Transparente' | 'Bronze' | 'Nenhuma';
  medidas: string;
  dimensaoTubo: string; // texto a exibir no Excel: "100 x 50", "150 x 50" ou valor manual
  valorM2?: string; // em centavos; apenas quando dimensão foi Manual
}

interface PergoladoState {
  tipoPolicarbonato: TipoPolicarbonato;
  corPolicarbonato: CorPolicarbonato;
  medidas: string;
  dimensaoTubo: DimensaoTubo;
  dimensaoTuboManual: string;
  valorM2: string;
  formTouched: boolean;
}

type PergoladoAction =
  | { type: 'SET_TIPO_POLICARBONATO'; payload: TipoPolicarbonato }
  | { type: 'SET_COR_POLICARBONATO'; payload: CorPolicarbonato }
  | { type: 'SET_MEDIDAS'; payload: string }
  | { type: 'SET_DIMENSAO_TUBO'; payload: DimensaoTubo }
  | { type: 'SET_DIMENSAO_TUBO_MANUAL'; payload: string }
  | { type: 'SET_VALOR_M2'; payload: string }
  | { type: 'SET_FORM_TOUCHED'; payload: boolean }
  | { type: 'RESET' };

const initialState: PergoladoState = {
  tipoPolicarbonato: null,
  corPolicarbonato: null,
  medidas: '',
  dimensaoTubo: null,
  dimensaoTuboManual: '',
  valorM2: '',
  formTouched: false,
};

function pergoladoReducer(state: PergoladoState, action: PergoladoAction): PergoladoState {
  switch (action.type) {
    case 'SET_TIPO_POLICARBONATO':
      return { ...state, tipoPolicarbonato: action.payload };
    case 'SET_COR_POLICARBONATO':
      return { ...state, corPolicarbonato: action.payload };
    case 'SET_MEDIDAS':
      return { ...state, medidas: action.payload };
    case 'SET_DIMENSAO_TUBO':
      return { ...state, dimensaoTubo: action.payload };
    case 'SET_DIMENSAO_TUBO_MANUAL':
      return { ...state, dimensaoTuboManual: action.payload };
    case 'SET_VALOR_M2':
      return { ...state, valorM2: action.payload };
    case 'SET_FORM_TOUCHED':
      return { ...state, formTouched: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface PergoladoContextValue extends PergoladoState {
  setTipoPolicarbonato: (v: TipoPolicarbonato) => void;
  setCorPolicarbonato: (v: CorPolicarbonato) => void;
  setMedidas: (v: string) => void;
  setDimensaoTubo: (v: DimensaoTubo) => void;
  setDimensaoTuboManual: (v: string) => void;
  setValorM2: (v: string) => void;
  setFormTouched: (v: boolean) => void;
  reset: () => void;
  canShowForm: boolean;
  buildFormData: () => PergoladoFormData | null;
}

const PergoladoContext = createContext<PergoladoContextValue | null>(null);

export function PergoladoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pergoladoReducer, initialState);

  const setTipoPolicarbonato = useCallback((payload: TipoPolicarbonato) => {
    dispatch({ type: 'SET_TIPO_POLICARBONATO', payload });
  }, []);
  const setCorPolicarbonato = useCallback((payload: CorPolicarbonato) => {
    dispatch({ type: 'SET_COR_POLICARBONATO', payload });
  }, []);
  const setMedidas = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS', payload });
  }, []);
  const setDimensaoTubo = useCallback((payload: DimensaoTubo) => {
    dispatch({ type: 'SET_DIMENSAO_TUBO', payload });
  }, []);
  const setDimensaoTuboManual = useCallback((payload: string) => {
    dispatch({ type: 'SET_DIMENSAO_TUBO_MANUAL', payload });
  }, []);
  const setValorM2 = useCallback((payload: string) => {
    dispatch({ type: 'SET_VALOR_M2', payload });
  }, []);
  const setFormTouched = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_FORM_TOUCHED', payload });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const canShowForm =
    state.tipoPolicarbonato !== null &&
    state.corPolicarbonato !== null &&
    state.dimensaoTubo !== null;

  const buildFormData = useCallback((): PergoladoFormData | null => {
    if (!state.tipoPolicarbonato || !state.corPolicarbonato || !state.dimensaoTubo) return null;
    const dimensaoExibir =
      state.dimensaoTubo === 'Manual'
        ? state.dimensaoTuboManual.trim() || 'Manual'
        : state.dimensaoTubo;
    const result: PergoladoFormData = {
      tipoPolicarbonato: state.tipoPolicarbonato,
      corPolicarbonato: state.corPolicarbonato,
      medidas: state.medidas,
      dimensaoTubo: dimensaoExibir,
    };
    if (state.dimensaoTubo === 'Manual' && state.valorM2) {
      result.valorM2 = state.valorM2;
    }
    return result;
  }, [state]);

  const value: PergoladoContextValue = {
    ...state,
    setTipoPolicarbonato,
    setCorPolicarbonato,
    setMedidas,
    setDimensaoTubo,
    setDimensaoTuboManual,
    setValorM2,
    setFormTouched,
    reset,
    canShowForm,
    buildFormData,
  };

  return (
    <PergoladoContext.Provider value={value}>
      {children}
    </PergoladoContext.Provider>
  );
}

export function usePergolado() {
  const ctx = useContext(PergoladoContext);
  if (!ctx) throw new Error('usePergolado must be used within PergoladoProvider');
  return ctx;
}
