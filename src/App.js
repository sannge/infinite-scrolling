import useBookSearch from "./useBookSearch";
import { useState, useRef, useCallback } from "react";

function App() {
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const observer = useRef();

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	const [data, loading, error, hasMore] = useBookSearch(query, pageNumber);

	const lastBookElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prev) => prev + 1);
				}
			});

			if (node) {
				observer.current.observe(node);
			}
		},
		[loading, hasMore]
	);

	return (
		<div className='App'>
			<>
				<input type='text' value={query} onChange={handleSearch} />
				{data.map((book, index) => {
					if (data.length === index + 1) {
						// wheneverr ref is set to useCallBack method,
						//it will call that useCallBack method!
						return (
							<div ref={lastBookElementRef} key={book}>
								{book}
							</div>
						);
					} else {
						return <div key={book}>{book}</div>;
					}
				})}
				<div>{loading && "Loading..."}</div>
				<div>{error && "Error"}</div>
			</>
		</div>
	);
}

export default App;
