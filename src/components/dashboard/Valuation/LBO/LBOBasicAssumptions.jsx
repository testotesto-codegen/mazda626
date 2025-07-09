import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FaCog } from 'react-icons/fa';
import PercentInput from '@/components/common/PercentInput';

const inputNumberNoSpinner = {
  MozAppearance: 'textfield',
  appearance: 'textfield',
};

const LBOBasicAssumptions = ({ setCurrScreen, debtFilledOut, isLoading }) => {
  const { register, control } = useFormContext();

  return (
    <div>
      <div className="text-[#A16BFB] p-4 flex items-center ml-4">
        <div className='text-xl'>
          Basic Assumptions
        </div>
        <button
          type='button'
          onClick={() => setCurrScreen("settings")}
          className="ml-auto m-4"
        >
          <FaCog />
        </button>
      </div>

      <div className="p-4 grid grid-cols-4 gap-x-12 gap-y-8 justify-items-center">
        <div className='flex flex-col w-32 text-sm items-center'>
          <div>Entry EBITDA</div>
          <input
            {...register("entry_ebita_multiple", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
        <div className='flex flex-col w-32 text-sm items-center'>
          <div>Exit EBITDA</div>
          <input
            {...register("exit_ebita_multiple", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
        <div className='flex flex-col w-32 text-sm items-center'>
          <div>Debt</div>
          <input
            {...register("debt", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
        <div className='flex flex-col w-32 text-sm items-center'>
          <div>Cash</div>
          <input
            {...register("cash", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
        <div className='flex flex-col w-32 text-sm items-center col-start-1'>
          <div>Exit Year</div>
          <input
            {...register("exit_year_sensitivity", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
        <div className='flex flex-col items-center col-start-2'>
          <div className='w-fit text-sm'>Debt Assumptions</div>
          <button
            className={`
              ${debtFilledOut ? "bg-green-400" : "bg-[#E46163]"}
              w-fit text-sm rounded-full mt-4 p-2 px-4 text-white hover:brightness-110 transition-all transition-200`}
            onClick={() => setCurrScreen("debt")}
            type='button'
          >
            Fill in Debt Assumptions
          </button>
        </div>
        <div className='flex flex-col w-48 text-sm items-center col-start-4'>
          <div>Capex (% of Sales)</div>
          <input
            {...register("capex_of_revenue", { valueAsNumber: true })}
            className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
            type='number'
            placeholder="0.0"
            style={inputNumberNoSpinner}
            onWheel={e => e.target.blur()}
          />
        </div>
      </div>

      <div className='w-full h-[1px] bg-[#424242] my-4'></div>

      <div className="text-[#A16BFB] p-4 flex items-center ml-4">
        <div className='text-xl'>
          Drivers
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-between">
        <div className='ml-8'>
          <div className='flex-col w-32 text-sm'>
            <div>Revenue Growth</div>
            <PercentInput
              name="revenue_growth"
              control={control}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
        <div className=''>
          <div className='flex-col text-sm'>
            <div>Gross Margin</div>
            <PercentInput
              name="gross_margin"
              control={control}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
        <div className=''>
          <div className='flex-col text-sm'>
            <div>Sales & Marketing</div>
            <PercentInput
              name="sales_percentage_of_revenue"
              control={control}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
        <div className=''>
          <div className='flex-col text-sm'>
            <div>Tax Rate</div>
            <PercentInput
              name="tax_rate"
              control={control}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
        <div className='mr-8'>
          <div className='flex-col text-sm'>
            <div>Depreciation</div>
            <PercentInput
              name="depreciation_of_revenue"
              control={control}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black text-sm focus:outline-none focus:ring-0 text-center'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
      </div>

      <div className='w-full h-[1px] bg-[#424242] my-4'></div>

      <div className="text-[#A16BFB] p-4 flex items-center ml-4">
        <div className='text-xl'>
          Interest Schedule
        </div>
      </div>

      <div className="p-4 flex flex-wrap mt-4">
        <div className='ml-8'>
          <div className='flex-col w-32 text-sm'>
            <div>LIBOR (bps)</div>
            <input
              {...register("libor_year_value", { valueAsNumber: true })}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
              type='number'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
        <div className='ml-8'>
          <div className='flex-col w-fit text-sm'>
            <div>Steps</div>
            <input
              {...register("libor_step", { valueAsNumber: true })}
              className='appearance-none w-32 rounded-full bg-[#D9D9D9] mt-4 p-2 text-black focus:outline-none focus:ring-0 text-center'
              type='number'
              placeholder="0.0"
              style={inputNumberNoSpinner}
              onWheel={e => e.target.blur()}
            />
          </div>
        </div>
      </div>

      <div className='flex justify-center'>
        <button
          type='submit'
          disabled={!debtFilledOut || isLoading}
          className={`
            ${debtFilledOut ? "hover:brightness-110" : "brightness-110"}
            rounded-full bg-[#A16BFB] m-8 mb-16 p-2 w-64 text-center text-white  transition-all transition-200`}
        >
          {isLoading ? (
            <div className='h-4 w-4 animate-spin rounded-full border-4 border-t-transparent border-white text-center inline-block justify-center'></div>
          ) : (
            <div>Generate</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default LBOBasicAssumptions;
