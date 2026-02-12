import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

export type TipoCobertura = 'ACM' | 'Chapa Metálica' | null;
export type TemPilar = 'Sim' | 'Não' | null;
export type CorACM = 'Preto' | 'Branco' | 'Cinza';
export type TelhaTermica = '30mm' | '50mm' | null;
export type ForroPvc = 'Tradicional' | 'Vinílico' | null;

export interface CoberturaFormData {
  tipoCobertura: 'ACM' | 'Chapa Metálica';
  temPilar: 'Sim' | 'Não';
  corOuPintura: string;
  telhaTermica: '30mm' | '50mm';
  forroPvc: 'Tradicional' | 'Vinílico';
  medidas: string;
  valorM2: string;
  valorPilar: string | null;
  medidaPilar: string | null;
  custoDeslocamento: string;
}

interface CoberturaState {
  step1: TipoCobertura;
  step2: TemPilar;
  step3: string | null;
  step4: TelhaTermica;
  step5: ForroPvc;
  medidas: string;
  valorM2: string;
  valorPilar: string;
  medidaPilar: string;
  custoDeslocamento: string;
  formTouched: boolean;
}

type CoberturaAction =
  | { type: 'SET_STEP1'; payload: TipoCobertura }
  | { type: 'SET_STEP2'; payload: TemPilar }
  | { type: 'SET_STEP3'; payload: string | null }
  | { type: 'SET_STEP4'; payload: TelhaTermica }
  | { type: 'SET_STEP5'; payload: ForroPvc }
  | { type: 'SET_MEDIDAS'; payload: string }
  | { type: 'SET_VALOR_M2'; payload: string }
  | { type: 'SET_VALOR_PILAR'; payload: string }
  | { type: 'SET_MEDIDA_PILAR'; payload: string }
  | { type: 'SET_CUSTO_DESLOCAMENTO'; payload: string }
  | { type: 'SET_FORM_TOUCHED'; payload: boolean }
  | { type: 'RESET' };

const initialState: CoberturaState = {
  step1: null,
  step2: null,
  step3: null,
  step4: null,
  step5: null,
  medidas: '',
  valorM2: '',
  valorPilar: '',
  medidaPilar: '',
  custoDeslocamento: '',
  formTouched: false,
};

function coberturaReducer(state: CoberturaState, action: CoberturaAction): CoberturaState {
  switch (action.type) {
    case 'SET_STEP1':
      return {
        ...state,
        step1: action.payload,
        step2: null,
        step3: null,
        step4: null,
        step5: null,
      };
    case 'SET_STEP2':
      return {
        ...state,
        step2: action.payload,
        step3: null,
        step4: null,
        step5: null,
      };
    case 'SET_STEP3':
      return { ...state, step3: action.payload, step4: null, step5: null };
    case 'SET_STEP4':
      return { ...state, step4: action.payload, step5: null };
    case 'SET_STEP5':
      return { ...state, step5: action.payload };
    case 'SET_MEDIDAS':
      return { ...state, medidas: action.payload };
    case 'SET_VALOR_M2':
      return { ...state, valorM2: action.payload };
    case 'SET_VALOR_PILAR':
      return { ...state, valorPilar: action.payload };
    case 'SET_MEDIDA_PILAR':
      return { ...state, medidaPilar: action.payload };
    case 'SET_CUSTO_DESLOCAMENTO':
      return { ...state, custoDeslocamento: action.payload };
    case 'SET_FORM_TOUCHED':
      return { ...state, formTouched: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface CoberturaContextValue extends CoberturaState {
  setStep1: (v: TipoCobertura) => void;
  setStep2: (v: TemPilar) => void;
  setStep3: (v: string | null) => void;
  setStep4: (v: TelhaTermica) => void;
  setStep5: (v: ForroPvc) => void;
  setMedidas: (v: string) => void;
  setValorM2: (v: string) => void;
  setValorPilar: (v: string) => void;
  setMedidaPilar: (v: string) => void;
  setCustoDeslocamento: (v: string) => void;
  setFormTouched: (v: boolean) => void;
  reset: () => void;
  canShowForm: boolean;
  buildFormData: () => CoberturaFormData | null;
}

const CoberturaContext = createContext<CoberturaContextValue | null>(null);

export function CoberturaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(coberturaReducer, initialState);

  const setStep1 = useCallback((payload: TipoCobertura) => {
    dispatch({ type: 'SET_STEP1', payload });
  }, []);
  const setStep2 = useCallback((payload: TemPilar) => {
    dispatch({ type: 'SET_STEP2', payload });
  }, []);
  const setStep3 = useCallback((payload: string | null) => {
    dispatch({ type: 'SET_STEP3', payload });
  }, []);
  const setStep4 = useCallback((payload: TelhaTermica) => {
    dispatch({ type: 'SET_STEP4', payload });
  }, []);
  const setStep5 = useCallback((payload: ForroPvc) => {
    dispatch({ type: 'SET_STEP5', payload });
  }, []);
  const setMedidas = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS', payload });
  }, []);
  const setValorM2 = useCallback((payload: string) => {
    dispatch({ type: 'SET_VALOR_M2', payload });
  }, []);
  const setValorPilar = useCallback((payload: string) => {
    dispatch({ type: 'SET_VALOR_PILAR', payload });
  }, []);
  const setMedidaPilar = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDA_PILAR', payload });
  }, []);
  const setCustoDeslocamento = useCallback((payload: string) => {
    dispatch({ type: 'SET_CUSTO_DESLOCAMENTO', payload });
  }, []);
  const setFormTouched = useCallback((payload: boolean) => {
    dispatch({ type: 'SET_FORM_TOUCHED', payload });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const canShowForm =
    state.step1 !== null && state.step2 !== null && state.step3 !== null && state.step4 !== null && state.step5 !== null;

  const buildFormData = useCallback((): CoberturaFormData | null => {
    if (!state.step1 || !state.step2 || !state.step3 || !state.step4 || !state.step5) return null;
    return {
      tipoCobertura: state.step1,
      temPilar: state.step2,
      corOuPintura: state.step3,
      telhaTermica: state.step4,
      forroPvc: state.step5,
      medidas: state.medidas,
      valorM2: state.valorM2,
      valorPilar: state.step2 === 'Sim' ? state.valorPilar : null,
      medidaPilar: state.step2 === 'Sim' ? (state.medidaPilar || null) : null,
      custoDeslocamento: state.custoDeslocamento,
    };
  }, [state]);

  const value: CoberturaContextValue = {
    ...state,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    setStep5,
    setMedidas,
    setValorM2,
    setValorPilar,
    setMedidaPilar,
    setCustoDeslocamento,
    setFormTouched,
    reset,
    canShowForm,
    buildFormData,
  };

  return (
    <CoberturaContext.Provider value={value}>
      {children}
    </CoberturaContext.Provider>
  );
}

export function useCobertura() {
  const ctx = useContext(CoberturaContext);
  if (!ctx) throw new Error('useCobertura must be used within CoberturaProvider');
  return ctx;
}
