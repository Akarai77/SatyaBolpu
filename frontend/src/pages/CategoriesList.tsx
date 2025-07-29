import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Card, { CardProps } from "../components/Card";

export type CategoryProps = {
    title?: string;
    items?: CardProps[];
}

const CategoriesList = () => {
    const [categoriesData, setCategoriesData] = useState<CategoryProps | null>(null);
    const [notFound, setNotFound] = useState(false);
    const { title } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/assets/data/data.json');
                const json = await res.json();

                const resData = json.categories.find(d => 
                    d.title.toLowerCase() === title?.toLowerCase()
                );

                if (!resData) {
                    setNotFound(true);
                    return;
                }

                setCategoriesData(resData);
            } catch (err) {
                console.error("Data fetch failed:", err);
                setNotFound(true);
            }
        };

        fetchData();
    }, [title]);

    if (notFound) return <Navigate to="/404" replace />;
    if (!categoriesData) return <div className="p-4">Loading...</div>;

    return (
        <div className="w-full bg-black flex flex-col flex-wrap py-20 gap-32 items-center justify-center">
            <h1 className="text-[4rem] font-semibold text-primary">{categoriesData.title}</h1>
            <div className="w-full flex flex-wrap items-center justify-center gap-16">
            {
                categoriesData.items &&
                    categoriesData.items.map((category,id) => (
                        <Card 
                            key={id}
                            title={category.title} 
                            image={category.image} 
                            route={`${title}/categories`}
                        />
                ))
            }           
            </div>
        </div>
    );
};

export default CategoriesList;

