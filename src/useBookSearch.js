import { useEffect, useState } from "react";
import axios from "axios";

function useBookSearch(query, pageNumber) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setData([]);
	}, [query]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			method: "GET",
			url: "http://openlibrary.org/search.json",
			params: {
				q: query,
				page: pageNumber,
			},
			//if there is new request and current request is still pending.
			//this cancelToken returning from cleanup function,
			//will cancel
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				setData((prevData) => {
					return [
						...new Set([...prevData, ...res.data.docs.map((b) => b.title)]),
					];
				});
				setHasMore(res.data.docs.length > 0);
				setLoading(false);
				console.log(res.data);
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					return;
				}
				setError(true);
			});

		return () => cancel();
	}, [query, pageNumber]);
	return [data, loading, error, hasMore];
}

export default useBookSearch;
