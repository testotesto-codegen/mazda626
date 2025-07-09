import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useProcessFilesMutation } from '@/api/endpoints';
import LBODebtAssumptions from './LBODebtAssumptions';
import LBOBasicAssumptions from './LBOBasicAssumptions';
import LBOSettings from './LBOSettings';
import LBOLoading from './LBOLoading';

const LBOUserInputs = () => {
  const [currScreen, setCurrScreen] = useState('basic');
  const [usingRevolver, setUsingRevolver] = useState(false);
  const [usingUnitranche, setUsingUnitranche] = useState(false);
  const [debtFilledOut, setDebtFilledOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const files = useSelector(state => state.lboFiles.files);
  const [processLbo] = useProcessFilesMutation();

  useEffect(() => {
    setDebtFilledOut(usingRevolver || usingUnitranche);
  }, [usingRevolver, usingUnitranche]);

  // Only wrap the form for screens that need it (debt/basic), not settings
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      entry_ebita_multiple: 0,
      exit_ebita_multiple: 0,
      exit_year_sensitivity: 0,
      management_option_pool: 0,
      management_fee_minimum: 0,
      management_fee_percentage_ebitda: 0,
      revolver_int_rate: 0,
      revolver_floor: 0,
      revolver_amortization: 0,
      revolver_sweep_rate: 0,
      revolver_xebitda_multiple: 0,
      unitranche_term_loan_int_rate: 0,
      unitranche_term_loan_floor: 0,
      unitranche_term_loan_amortization: 0,
      unitranche_term_loan_sweep_rate: 0,
      unitranche_term_loan_xebitda_multiple: 0,
      revenue_growth: 0,
      gross_margin: 0,
      sales_percentage_of_revenue: 0,
      tax_rate: 0,
      revolver_facility: 0,
      unused_revolver_fee: 0,
      minimum_cash: 0,
      circuit_breaker: 0,
      years_financing_amortization: 0,
      interest_rate_on_cash: 0,
      capex_of_revenue: 0,
      depreciation_of_revenue: 0,
      libor_step: 0,
      libor_year_value: 0,
      cash_flow_equity: 0,
      financing_fee: 0,
      transaction_fee: 0,
      management_fee_of_ebitda: 0,
      debt: 0,
      cash: 0,
    }
  });

  const handleSubmit = methods.handleSubmit(async (inputs) => {
    setIsLoading(true);
    try {
      const response = await processLbo({
        file_signatures: files,
        params: inputs,
      });
      if (response.error) {
        alert('An error occurred: ' + (response.error.message || 'Unknown error'));
        setIsLoading(false);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'LBO-Model.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('An error occurred: ' + (error.message || 'Unknown error'));
    }
    setIsLoading(false);
  });

  return (
    <>
      {currScreen === "debt" || currScreen === "basic" ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="flex h-fit">
            <div className="md:w-1/3 w-0 text-white relative z-0">
              <LBOLoading />
            </div>
            <div className="md:w-2/3 w-100 text-white bg-[#1D2022] relative z-10">
              {currScreen === "debt" ? (
                <LBODebtAssumptions
                  setCurrScreen={setCurrScreen}
                  usingRevolver={usingRevolver}
                  setUsingRevolver={setUsingRevolver}
                  usingUnitranche={usingUnitranche}
                  setUsingUnitranche={setUsingUnitranche}
                />
              ) : (
                <LBOBasicAssumptions
                  setCurrScreen={setCurrScreen}
                  debtFilledOut={debtFilledOut}
                  isLoading={isLoading}
                />
              )}
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="flex h-fit">
          <div className="md:w-1/3 w-0 text-white relative z-0">
            <LBOLoading />
          </div>
          <div className="md:w-2/3 w-100 text-white bg-[#1D2022] relative z-10">
            <LBOSettings setCurrScreen={setCurrScreen} />
          </div>
        </div>
      )}
    </>
  );
};

export default LBOUserInputs;
