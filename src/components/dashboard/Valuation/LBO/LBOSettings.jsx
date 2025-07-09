import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaCog } from "react-icons/fa";

import PercentInput from "@/components/common/PercentInput";

import {
  useGetLboSettingsQuery,
  useSaveLboSettingsMutation,
} from "@/api/endpoints/lobApi";

const defaultValues = {
  minimum_cash: 0,
  management_fee_of_ebitda: 0,
  revolver_facility: 0,
  unused_revolver_fee: 0,
  circuit_breaker: 0,
  years_financing_amortization: 0,
  interest_rate_on_cash: 0,
  transaction_fee: 0,
  financing_fee: 0,
};

const LBOSettings = ({ setCurrScreen }) => {
  const { data: settings } = useGetLboSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [saveLboSettings] = useSaveLboSettingsMutation();
  const {
    register,
    reset,
    getValues,
    control,
  } = useForm({ defaultValues, mode: "onChange" });

  // Save on blur handler for all fields
  const handleBlur = () => {
    console.log(getValues())
    saveLboSettings(getValues());
  };

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  return (
    <div>
      <style>
        {`
          /* Hide number input spinners for all browsers */
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <div className="flex">
        <div className="bg-[#A16BFB] p-2 text-white ml-auto m-6 rounded-md">
          <FaCog />
        </div>
      </div>

      <div className="flex justify-center text-bold text-3xl">LBO Settings</div>

      <div className="flex flex-col items-center mt-8">
        <div className="mb-4 text-bold text-lg">Management Fee</div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Minimum $</div>
            <div className="w-1/2 flex justify-start">

              <input
                {...register("management_fee_minimum", { valueAsNumber: true })}
                className="appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
                type="number"
                placeholder="0.0"
                style={{ MozAppearance: "textfield" }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">
              Management Fee % of EBITDA
            </div>
            <div className="w-1/2 flex justify-start">
              <PercentInput
                name="management_fee_percentage_ebitda"
                control={control}
                onBlur={handleBlur}
                className="appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
                placeholder="0.0"
                style={{ MozAppearance: "textfield" }}
                onWheel={e => e.target.blur()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <div className="mb-4 text-bold text-lg">
          Other Financing Assumptions
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Revolver Facility</div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("revolver_facility", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Unused Revolver Fee</div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("unused_revolver_fee", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">
              Circuit Breaker (1=Avg Interest, 0=Beg Int.)
            </div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("circuit_breaker", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">
              Financing Fee Amortization (years)
            </div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("years_financing_amortization", {
                  valueAsNumber: true,
                })}
                className="appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center"
                type="number"
                placeholder="0.0"
                style={{ MozAppearance: "textfield" }}
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Interest Rate on Cash</div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("circuit_breaker", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Transaction Fees</div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("years_financing_amortization", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-1/2 text-right mr-4">Financing Fees</div>
            <div className="w-1/2 flex justify-start">
              <input
                {...register("financing_fee", { valueAsNumber: true })}
                className='appearance-none w-28 rounded-full bg-[#D9D9D9] p-2 text-black focus:outline-none focus:ring-0 text-xs text-center'
                type='number'
                placeholder="0.0"
                style={{ MozAppearance: 'textfield' }}
                onWheel={e => e.target.blur()}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCurrScreen("basic")}
          className="rounded-full bg-[#A16BFB] m-8 mb-16 p-2 w-64 text-center text-white hover:brightness-110 transition-all transition-200"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LBOSettings;
