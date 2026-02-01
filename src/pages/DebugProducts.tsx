import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DebugProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        console.log(msg);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            addLog("🔍 Starting fetch...");

            try {
                addLog("🔍 Building query for 'products' table...");

                const { data, error, count, status, statusText } = await supabase
                    .from("products")
                    .select("*", { count: "exact" })
                    .limit(20);

                addLog(`🔍 Response received!`);
                addLog(`🔍 Status: ${status} ${statusText}`);
                addLog(`🔍 Count: ${count}`);
                addLog(`🔍 Error: ${error ? JSON.stringify(error) : "null"}`);
                addLog(`🔍 Data type: ${typeof data}`);
                addLog(`🔍 Is Array: ${Array.isArray(data)}`);
                addLog(`🔍 Data length: ${data?.length || 0}`);

                if (error) {
                    addLog(`❌ ERROR: ${error.message}`);
                    addLog(`❌ Error code: ${error.code}`);
                    addLog(`❌ Error details: ${error.details}`);
                    addLog(`❌ Error hint: ${error.hint}`);
                }

                if (data && data.length > 0) {
                    addLog(`✅ Got ${data.length} products!`);
                    addLog(`✅ First product: ${data[0].name}`);
                    setProducts(data);
                } else {
                    addLog(`⚠️ Data is empty or null`);
                }
            } catch (err: any) {
                addLog(`💥 CATCH ERROR: ${err.message}`);
                addLog(`💥 Error stack: ${err.stack}`);
            } finally {
                setLoading(false);
                addLog("🏁 Fetch complete");
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">🔍 Debug Product Fetch</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-bold mb-2">Status</h2>
                    <p>Loading: {loading ? "Yes" : "No"}</p>
                    <p>Products: {products.length}</p>
                </div>

                <div className="bg-blue-100 p-4 rounded max-h-96 overflow-y-auto">
                    <h2 className="font-bold mb-2">Console Logs</h2>
                    {logs.map((log, i) => (
                        <div key={i} className="text-xs font-mono mb-1">{log}</div>
                    ))}
                </div>
            </div>

            <div className="bg-white border rounded p-4">
                <h2 className="text-xl font-bold mb-4">Products ({products.length})</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {products.map((p) => (
                            <div key={p.id} className="border p-3 rounded">
                                {p.image_url && (
                                    <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover mb-2" />
                                )}
                                <h3 className="font-bold text-sm">{p.name}</h3>
                                <p className="text-xs text-gray-600">₹{p.price}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products loaded</p>
                )}
            </div>
        </div>
    );
};

export default DebugProducts;
