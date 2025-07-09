

const LBOLoading = () => {

    return (
        <section className={``}>
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
                Building your LBO...
            </h2>
        </section>
    )
}

export default LBOLoading;