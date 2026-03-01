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
export type TipoMedidas = 'area_unica' | 'duas_areas' | 'tres_areas' | 'm2_direto';

/** Valor fixo por m² em centavos: Compacto 3mm = R$ 1.200,00; Alveolar 6mm = R$ 800,00 */
export const PERGOLADO_VALOR_M2_FIXO: Record<
  'Compacto 3mm' | 'Alveolar 6mm',
  string
> = {
  'Compacto 3mm': '120000',
  'Alveolar 6mm': '80000',
};

export interface PergoladoFormData {
  tipoPolicarbonato: 'Compacto 3mm' | 'Alveolar 6mm';
  corPolicarbonato: 'Fumê' | 'Cinza refletivo' | 'Transparente' | 'Bronze' | 'Nenhuma';
  tipoMedidas: TipoMedidas;
  medidas: string;
  medidas1?: string;
  medidas2?: string;
  medidas3?: string;
  m2Direto?: string;
  dimensaoTubo: string; // texto a exibir no Excel: "100 x 50", "150 x 50" ou valor manual
  valorM2?: string; // em centavos; apenas quando dimensão foi Manual
  custoDeslocamento: string;
  descricaoAdicional?: string;
}

interface PergoladoState {
  tipoPolicarbonato: TipoPolicarbonato;
  corPolicarbonato: CorPolicarbonato;
  tipoMedidas: TipoMedidas;
  medidas: string;
  medidas1: string;
  medidas2: string;
  medidas3: string;
  m2Direto: string;
  dimensaoTubo: DimensaoTubo;
  dimensaoTuboManual: string;
  valorM2: string;
  valorM2Locked: boolean;
  custoDeslocamento: string;
  descricaoAdicional: string;
  formTouched: boolean;
}

type PergoladoAction =
  | { type: 'SET_TIPO_POLICARBONATO'; payload: TipoPolicarbonato }
  | { type: 'SET_COR_POLICARBONATO'; payload: CorPolicarbonato }
  | { type: 'SET_TIPO_MEDIDAS'; payload: TipoMedidas }
  | { type: 'SET_MEDIDAS'; payload: string }
  | { type: 'SET_MEDIDAS1'; payload: string }
  | { type: 'SET_MEDIDAS2'; payload: string }
  | { type: 'SET_MEDIDAS3'; payload: string }
  | { type: 'SET_M2_DIRETO'; payload: string }
  | { type: 'SET_DIMENSAO_TUBO'; payload: DimensaoTubo }
  | { type: 'SET_DIMENSAO_TUBO_MANUAL'; payload: string }
  | { type: 'SET_VALOR_M2'; payload: string }
  | { type: 'SET_VALOR_M2_LOCKED'; payload: boolean }
  | { type: 'SET_CUSTO_DESLOCAMENTO'; payload: string }
  | { type: 'SET_DESCRICAO_ADICIONAL'; payload: string }
  | { type: 'SET_FORM_TOUCHED'; payload: boolean }
  | { type: 'RESET' };

const initialState: PergoladoState = {
  tipoPolicarbonato: null,
  corPolicarbonato: null,
  tipoMedidas: 'area_unica',
  medidas: '',
  medidas1: '',
  medidas2: '',
  medidas3: '',
  m2Direto: '',
  dimensaoTubo: null,
  dimensaoTuboManual: '',
  valorM2: '',
  valorM2Locked: true,
  custoDeslocamento: '',
  descricaoAdicional: '',
  formTouched: false,
};

function pergoladoReducer(state: PergoladoState, action: PergoladoAction): PergoladoState {
  switch (action.type) {
    case 'SET_TIPO_POLICARBONATO': {
      const payload = action.payload;
      if (!payload) return { ...state, tipoPolicarbonato: payload };
      const fixedValor = PERGOLADO_VALOR_M2_FIXO[payload];
      return {
        ...state,
        tipoPolicarbonato: payload,
        valorM2: fixedValor,
        valorM2Locked: true,
      };
    }
    case 'SET_COR_POLICARBONATO':
      return { ...state, corPolicarbonato: action.payload };
    case 'SET_TIPO_MEDIDAS':
      return { ...state, tipoMedidas: action.payload };
    case 'SET_MEDIDAS':
      return { ...state, medidas: action.payload };
    case 'SET_MEDIDAS1':
      return { ...state, medidas1: action.payload };
    case 'SET_MEDIDAS2':
      return { ...state, medidas2: action.payload };
    case 'SET_MEDIDAS3':
      return { ...state, medidas3: action.payload };
    case 'SET_M2_DIRETO':
      return { ...state, m2Direto: action.payload };
    case 'SET_DIMENSAO_TUBO':
      return { ...state, dimensaoTubo: action.payload };
    case 'SET_DIMENSAO_TUBO_MANUAL':
      return { ...state, dimensaoTuboManual: action.payload };
    case 'SET_VALOR_M2':
      return { ...state, valorM2: action.payload };
    case 'SET_VALOR_M2_LOCKED':
      return { ...state, valorM2Locked: action.payload };
    case 'SET_CUSTO_DESLOCAMENTO':
      return { ...state, custoDeslocamento: action.payload };
    case 'SET_DESCRICAO_ADICIONAL':
      return { ...state, descricaoAdicional: action.payload };
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
  setTipoMedidas: (v: TipoMedidas) => void;
  setMedidas: (v: string) => void;
  setMedidas1: (v: string) => void;
  setMedidas2: (v: string) => void;
  setMedidas3: (v: string) => void;
  setM2Direto: (v: string) => void;
  setDimensaoTubo: (v: DimensaoTubo) => void;
  setDimensaoTuboManual: (v: string) => void;
  setValorM2: (v: string) => void;
  setValorM2Locked: (v: boolean) => void;
  setCustoDeslocamento: (v: string) => void;
  setDescricaoAdicional: (v: string) => void;
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
  const setTipoMedidas = useCallback((payload: TipoMedidas) => {
    dispatch({ type: 'SET_TIPO_MEDIDAS', payload });
  }, []);
  const setMedidas = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS', payload });
  }, []);
  const setMedidas1 = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS1', payload });
  }, []);
  const setMedidas2 = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS2', payload });
  }, []);
  const setMedidas3 = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS3', payload });
  }, []);
  const setM2Direto = useCallback((payload: string) => {
    dispatch({ type: 'SET_M2_DIRETO', payload });
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
  const setValorM2Locked = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_VALOR_M2_LOCKED', payload });
  }, []);
  const setCustoDeslocamento = useCallback((payload: string) => {
    dispatch({ type: 'SET_CUSTO_DESLOCAMENTO', payload });
  }, []);
  const setDescricaoAdicional = useCallback((payload: string) => {
    dispatch({ type: 'SET_DESCRICAO_ADICIONAL', payload });
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

  const buildMedidasPayload = useCallback(() => {
    if (state.tipoMedidas === 'duas_areas') {
      return {
        tipoMedidas: 'duas_areas' as const,
        medidas: [state.medidas1, state.medidas2].filter(Boolean).join(' e '),
        medidas1: state.medidas1,
        medidas2: state.medidas2,
      };
    }
    if (state.tipoMedidas === 'tres_areas') {
      return {
        tipoMedidas: 'tres_areas' as const,
        medidas: [state.medidas1, state.medidas2, state.medidas3].filter(Boolean).join(' e '),
        medidas1: state.medidas1,
        medidas2: state.medidas2,
        medidas3: state.medidas3,
      };
    }
    if (state.tipoMedidas === 'm2_direto') {
      return {
        tipoMedidas: 'm2_direto' as const,
        medidas: '',
        m2Direto: state.m2Direto.trim(),
      };
    }
    return { tipoMedidas: 'area_unica' as const, medidas: state.medidas };
  }, [state.tipoMedidas, state.medidas, state.medidas1, state.medidas2, state.medidas3, state.m2Direto]);

  const buildFormData = useCallback((): PergoladoFormData | null => {
    if (!state.tipoPolicarbonato || !state.corPolicarbonato || !state.dimensaoTubo) return null;
    const dimensaoExibir =
      state.dimensaoTubo === 'Manual'
        ? state.dimensaoTuboManual.trim() || 'Manual'
        : state.dimensaoTubo;
    const result: PergoladoFormData = {
      tipoPolicarbonato: state.tipoPolicarbonato,
      corPolicarbonato: state.corPolicarbonato,
      ...buildMedidasPayload(),
      dimensaoTubo: dimensaoExibir,
      custoDeslocamento: state.custoDeslocamento,
    };
    if (state.valorM2) {
      result.valorM2 = state.valorM2;
    }
    if (state.descricaoAdicional.trim()) {
      result.descricaoAdicional = state.descricaoAdicional.trim();
    }
    return result;
  }, [state, buildMedidasPayload]);

  const value: PergoladoContextValue = {
    ...state,
    setTipoPolicarbonato,
    setCorPolicarbonato,
    setTipoMedidas,
    setMedidas,
    setMedidas1,
    setMedidas2,
    setMedidas3,
    setM2Direto,
    setDimensaoTubo,
    setDimensaoTuboManual,
    setValorM2,
    setValorM2Locked,
    setCustoDeslocamento,
    setDescricaoAdicional,
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
