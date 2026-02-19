import { usePergolado } from '../context/PergoladoContext';
import type { PergoladoFormData } from '../context/PergoladoContext';
import { StepButtons } from '../components/StepButtons';
import { CurrencyInput } from '../components/CurrencyInput';
import { MedidasInput, validateMedidas } from '../components/MedidasInput';

interface PergoladoScreenProps {
  onBack: () => void;
  onConfirm: (data: PergoladoFormData) => void;
}

const CORES_POLICARBONATO = [
  { value: 'Fumê', label: 'Fumê' },
  { value: 'Cinza refletivo', label: 'Cinza refletivo' },
  { value: 'Transparente', label: 'Transparente' },
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Nenhuma', label: 'Nenhuma' },
] as const;

export function PergoladoScreen({ onBack, onConfirm }: PergoladoScreenProps) {
  const {
    tipoPolicarbonato,
    corPolicarbonato,
    medidas,
    dimensaoTubo,
    dimensaoTuboManual,
    valorM2,
    setTipoPolicarbonato,
    setCorPolicarbonato,
    setMedidas,
    setDimensaoTubo,
    setDimensaoTuboManual,
    setValorM2,
    canShowForm,
    formTouched,
    setFormTouched,
    buildFormData,
  } = usePergolado();

  const isManual = dimensaoTubo === 'Manual';

  const handleSubmit = () => {
    setFormTouched(true);
    if (!canShowForm || !tipoPolicarbonato || !corPolicarbonato || !dimensaoTubo) return;

    const okMedidas = validateMedidas(medidas);
    const okManual =
      !isManual || (dimensaoTuboManual.trim().length > 0 && valorM2.length > 0 && parseInt(valorM2, 10) > 0);

    if (!okMedidas || !okManual) return;

    const data = buildFormData();
    if (data) onConfirm(data);
  };

  const canSubmitForm =
    validateMedidas(medidas) &&
    (!isManual || (dimensaoTuboManual.trim().length > 0 && valorM2.length > 0 && parseInt(valorM2, 10) > 0));

  return (
    <div className="min-h-full flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-semibold text-white mb-1">Pergolado</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-2">
        Dados do orçamento
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Preencha as opções e as medidas do pergolado.
      </p>

      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">1. Tipo de Policarbonato</p>
        <StepButtons
          options={[
            { value: 'Compacto 3mm', label: 'Compacto 3mm' },
            { value: 'Alveolar 6mm', label: 'Alveolar 6mm' },
          ]}
          value={tipoPolicarbonato}
          onChange={(v) => setTipoPolicarbonato(v as 'Compacto 3mm' | 'Alveolar 6mm')}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">2. Cor do Policarbonato</p>
        <StepButtons
          options={[...CORES_POLICARBONATO]}
          value={corPolicarbonato}
          onChange={(v) => setCorPolicarbonato(v)}
          disabled={tipoPolicarbonato === null}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">3. Medidas do Pergolado</p>
        <MedidasInput
          id="medidas-pergolado"
          label="Medidas"
          value={medidas}
          onChange={setMedidas}
          placeholder="5,00m x 2,00m"
          hint="5,00m x 2,00m"
          error={formTouched && !validateMedidas(medidas) ? 'Use o formato: 5,00m x 2,00m' : undefined}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-white mb-3">4. Dimensão do Tubo Retangular</p>
        <StepButtons
          options={[
            { value: '100 x 50', label: '100 x 50' },
            { value: '150 x 50', label: '150 x 50' },
            { value: 'Manual', label: 'Digitar manualmente' },
          ]}
          value={dimensaoTubo}
          onChange={(v) => setDimensaoTubo(v as '100 x 50' | '150 x 50' | 'Manual')}
          disabled={corPolicarbonato === null}
        />
      </div>

      {isManual && (
        <div className="space-y-6 pt-4 border-t border-[var(--color-border)]">
          <div>
            <label
              htmlFor="dimensao-tubo-manual"
              className="block text-sm font-medium text-white mb-2"
            >
              Dimensão (ex.: 120 x 60)
            </label>
            <input
              id="dimensao-tubo-manual"
              type="text"
              value={dimensaoTuboManual}
              onChange={(e) => setDimensaoTuboManual(e.target.value)}
              placeholder="120 x 60"
              className="w-full py-3 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              aria-invalid={formTouched && !dimensaoTuboManual.trim()}
            />
            {formTouched && !dimensaoTuboManual.trim() && (
              <p className="mt-1 text-xs text-amber-400">Informe a dimensão do tubo.</p>
            )}
          </div>
          <CurrencyInput
            id="valor-m2-pergolado"
            label="Valor por m²"
            value={valorM2}
            onChange={setValorM2}
            placeholder="1.200,00"
            hint="R$ 1.200,00"
          />
        </div>
      )}

      {canShowForm && (
        <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmitForm}
            className="w-full py-4 rounded-[var(--radius-lg)] font-medium bg-[var(--color-accent)] text-[#0d0d0d] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-accent)] transition-all"
          >
            Continuar
          </button>
        </div>
      )}

      {!canShowForm && (
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          Selecione todas as opções acima para continuar.
        </p>
      )}
    </div>
  );
}
