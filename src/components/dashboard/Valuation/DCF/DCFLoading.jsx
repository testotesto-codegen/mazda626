import { useEffect, useState } from 'react';
import './dcf_loader.css';

function ProgressBar({ value }) {
    return (
        <div className="relative w-1/2 mx-auto text-center h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-[#A16BFB] transition-all duration-500"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}

/* eslint-disable react/prop-types */
const DCFLoading = ({ loadingMenu, loadingDCF, finishedLoading, ticker }) => {
	const [progressValue, setProgressValue] = useState(0);
	const [progressStatus, setProgressStatus] = useState("");

	const statuses = [
		"Scraping EDGAR Database",
		"Thinking...",
		"Querying Facts",
		"Assembling Data",
		"Inserting Data into Template",
		"Wrapping up"
	]

	useEffect(() => {
		let interval;
		let counter = 0;
		if (loadingDCF) {
			if (finishedLoading) {
				setProgressValue(100);
				setProgressStatus("Complete!");
				return;
			} else {
				setProgressValue(0);
				setProgressStatus("");
				interval = setInterval(() => {
					if (counter % 2 == 0) {
						setProgressStatus(statuses[counter / 2]);
					}
					setProgressValue((prev) => (prev < 100 ? prev + 5 : 100));
					counter += 1;
					if (counter > 10) {
						counter = 10;
					}
				}, 5000);
				setProgressValue(0);
			}
		}

        return () => {
			clearInterval(interval);
			setProgressStatus("");
			setProgressValue(0);
		}
    }, [finishedLoading, loadingDCF]);
	//increment();

	return (
		<div className={`${loadingMenu ? 'static' : 'absolute left-[100%]'} ${loadingDCF ? 'w-full' : 'w-1/2'} bg-[#121416]`}>
			<section className={`${loadingDCF ? 'hidden' : 'visible'}`}>
				<div className="cssload-container">
					<div className="cssload-cube">
						<div className="cssload-half1">
							<div className="cssload-side cssload-s1"></div>
							<div className="cssload-side cssload-s2"></div>
							<div className="cssload-side cssload-s5"></div>
						</div>
						<div className="cssload-half2">
							<div className="cssload-side cssload-s3"></div>
							<div className="cssload-side cssload-s4"></div>
							<div className="cssload-side cssload-s6"></div>
						</div>
					</div>
				</div>
				<h2 className="text-[#fff] text-3xl xl:text-4xl font-medium text-center -mt-10">
					Building a DCF for: {ticker}
				</h2>
			</section>
			<section className={`${loadingDCF ? 'visible' : 'hidden'} relative`}>
				<div id="loader" className=''>
					<div id="box"></div>
					<div id="hill"></div>
				</div>
				<div className='text-white relative top-[50%] w-auto text-center'>Generating your DCF...</div>
				<div className='text-white text-center top-[15em] relative'>
					<ProgressBar value={progressValue}/>
				</div>
				<div className='text-white text-center top-[16em] relative'>
					{progressStatus}
				</div>
			</section>
		</div>
		
	);
};

export default DCFLoading;
