import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

export type TipoCoberturaRetratil =
  | 'Telha Térmica'
  | 'Policarbonato Compacto 3mm'
  | 'Policarbonato Alveolar 6mm'
  | null;
export type CorParteSuperior = 'Natural' | 'Preta' | null;
export type CorParteInferior = 'Amadeirado' | 'Branco' | 'Preto' | null;
export type CorEstrutura = 'Preto' | 'Branca' | 'Outra' | null;
export type ModoAbertura = 'Manual' | 'Automatizada' | null;

export interface CoberturaRetratilFormData {
  tipoCobertura: 'Telha Térmica' | 'Policarbonato Compacto 3mm' | 'Policarbonato Alveolar 6mm';
  corParteSuperior: 'Natural' | 'Preta';
  corParteInferior: 'Amadeirado' | 'Branco' | 'Preto';
  corEstrutura: 'Preto' | 'Branca' | 'Outra';
  corEstruturaOutra: string;
  modoAbertura: 'Manual' | 'Automatizada';
  medidas: string;
  valorM2: string;
  custoAberturaAutomatizada: string;
  custoDeslocamento: string;
}

interface CoberturaRetratilState {
  step1: TipoCoberturaRetratil;
  step2: CorParteSuperior;
  step3: CorParteInferior;
  step4: CorEstrutura;
  step5: ModoAbertura;
  corEstruturaOutra: string;
  medidas: string;
  valorM2: string;
  custoAberturaAutomatizada: string;
  custoDeslocamento: string;
  formTouched: boolean;
}

type CoberturaRetratilAction =
  | { type: 'SET_STEP1'; payload: TipoCoberturaRetratil }
  | { type: 'SET_STEP2'; payload: CorParteSuperior }
  | { type: 'SET_STEP3'; payload: CorParteInferior }
  | { type: 'SET_STEP4'; payload: CorEstrutura }
  | { type: 'SET_STEP5'; payload: ModoAbertura }
  | { type: 'SET_COR_ESTRUTURA_OUTRA'; payload: string }
  | { type: 'SET_MEDIDAS'; payload: string }
  | { type: 'SET_VALOR_M2'; payload: string }
  | { type: 'SET_CUSTO_ABERTURA_AUTOMATIZADA'; payload: string }
  | { type: 'SET_CUSTO_DESLOCAMENTO'; payload: string }
  | { type: 'SET_FORM_TOUCHED'; payload: boolean }
  | { type: 'RESET' };

const initialState: CoberturaRetratilState = {
  step1: null,
  step2: null,
  step3: null,
  step4: null,
  step5: null,
  corEstruturaOutra: '',
  medidas: '',
  valorM2: '',
  custoAberturaAutomatizada: '',
  custoDeslocamento: '',
  formTouched: false,
};

function coberturaRetratilReducer(
  state: CoberturaRetratilState,
  action: CoberturaRetratilAction
): CoberturaRetratilState {
  switch (action.type) {
    case 'SET_STEP1':
      return { ...state, step1: action.payload };
    case 'SET_STEP2':
      return { ...state, step2: action.payload };
    case 'SET_STEP3':
      return { ...state, step3: action.payload };
    case 'SET_STEP4':
      return { ...state, step4: action.payload };
    case 'SET_STEP5':
      return { ...state, step5: action.payload };
    case 'SET_COR_ESTRUTURA_OUTRA':
      return { ...state, corEstruturaOutra: action.payload };
    case 'SET_MEDIDAS':
      return { ...state, medidas: action.payload };
    case 'SET_VALOR_M2':
      return { ...state, valorM2: action.payload };
    case 'SET_CUSTO_ABERTURA_AUTOMATIZADA':
      return { ...state, custoAberturaAutomatizada: action.payload };
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

interface CoberturaRetratilContextValue extends CoberturaRetratilState {
  setStep1: (v: TipoCoberturaRetratil) => void;
  setStep2: (v: CorParteSuperior) => void;
  setStep3: (v: CorParteInferior) => void;
  setStep4: (v: CorEstrutura) => void;
  setStep5: (v: ModoAbertura) => void;
  setCorEstruturaOutra: (v: string) => void;
  setMedidas: (v: string) => void;
  setValorM2: (v: string) => void;
  setCustoAberturaAutomatizada: (v: string) => void;
  setCustoDeslocamento: (v: string) => void;
  setFormTouched: (v: boolean) => void;
  reset: () => void;
  canShowForm: boolean;
  buildFormData: () => CoberturaRetratilFormData | null;
}

const CoberturaRetratilContext = createContext<CoberturaRetratilContextValue | null>(null);

export function CoberturaRetratilProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(coberturaRetratilReducer, initialState);

  const setStep1 = useCallback((payload: TipoCoberturaRetratil) => {
    dispatch({ type: 'SET_STEP1', payload });
  }, []);
  const setStep2 = useCallback((payload: CorParteSuperior) => {
    dispatch({ type: 'SET_STEP2', payload });
  }, []);
  const setStep3 = useCallback((payload: CorParteInferior) => {
    dispatch({ type: 'SET_STEP3', payload });
  }, []);
  const setStep4 = useCallback((payload: CorEstrutura) => {
    dispatch({ type: 'SET_STEP4', payload });
  }, []);
  const setStep5 = useCallback((payload: ModoAbertura) => {
    dispatch({ type: 'SET_STEP5', payload });
  }, []);
  const setCorEstruturaOutra = useCallback((payload: string) => {
    dispatch({ type: 'SET_COR_ESTRUTURA_OUTRA', payload });
  }, []);
  const setMedidas = useCallback((payload: string) => {
    dispatch({ type: 'SET_MEDIDAS', payload });
  }, []);
  const setValorM2 = useCallback((payload: string) => {
    dispatch({ type: 'SET_VALOR_M2', payload });
  }, []);
  const setCustoAberturaAutomatizada = useCallback((payload: string) => {
    dispatch({ type: 'SET_CUSTO_ABERTURA_AUTOMATIZADA', payload });
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

  const isPolicarbonato =
    state.step1 === 'Policarbonato Compacto 3mm' || state.step1 === 'Policarbonato Alveolar 6mm';

  const canShowForm = (() => {
    if (!state.step1 || !state.step5) return false;
    if (isPolicarbonato) return true;
    // Telha Térmica: exige steps 2, 3, 4 e, se "outra", corEstruturaOutra preenchida
    return (
      state.step2 !== null &&
      state.step3 !== null &&
      state.step4 !== null &&
      (state.step4 !== 'Outra' || state.corEstruturaOutra.trim().length > 0)
    );
  })();

  const buildFormData = useCallback((): CoberturaRetratilFormData | null => {
    if (!state.step1 || !state.step5) return null;
    if (isPolicarbonato) {
      return {
        tipoCobertura: state.step1,
        corParteSuperior: 'Natural',
        corParteInferior: 'Amadeirado',
        corEstrutura: 'Preto',
        corEstruturaOutra: '',
        modoAbertura: state.step5,
        medidas: state.medidas,
        valorM2: state.valorM2,
        custoAberturaAutomatizada: state.custoAberturaAutomatizada,
        custoDeslocamento: state.custoDeslocamento,
      };
    }
    if (
      !state.step2 ||
      !state.step3 ||
      !state.step4 ||
      (state.step4 === 'Outra' && !state.corEstruturaOutra.trim())
    ) {
      return null;
    }
    return {
      tipoCobertura: state.step1,
      corParteSuperior: state.step2,
      corParteInferior: state.step3,
      corEstrutura: state.step4,
      corEstruturaOutra: state.step4 === 'Outra' ? state.corEstruturaOutra.trim() : '',
      modoAbertura: state.step5,
      medidas: state.medidas,
      valorM2: state.valorM2,
      custoAberturaAutomatizada: state.custoAberturaAutomatizada,
      custoDeslocamento: state.custoDeslocamento,
    };
  }, [state, isPolicarbonato]);

  const value: CoberturaRetratilContextValue = {
    ...state,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    setStep5,
    setCorEstruturaOutra,
    setMedidas,
    setValorM2,
    setCustoAberturaAutomatizada,
    setCustoDeslocamento,
    setFormTouched,
    reset,
    canShowForm,
    buildFormData,
  };

  return (
    <CoberturaRetratilContext.Provider value={value}>
      {children}
    </CoberturaRetratilContext.Provider>
  );
}

export function useCoberturaRetratil() {
  const ctx = useContext(CoberturaRetratilContext);
  if (!ctx) throw new Error('useCoberturaRetratil must be used within CoberturaRetratilProvider');
  return ctx;
}
