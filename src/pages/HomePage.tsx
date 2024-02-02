import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
interface Product {
    name: string;
    quantity: number;
    rate: number;
    total: number;
}

function HomePage() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();


    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);
    const [rate, setRate] = useState<number>(0);
    const addProduct = () => {
        const newProduct: Product = {
            name: productName,
            quantity: quantity,
            rate: rate,
            total: quantity * rate,
        };

        setProducts([...products, newProduct]);
        setProductName('');
        setQuantity(0);
        setRate(0);
    };
    const deleteProduct = (index: number) => {
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts.splice(index, 1);
            return updatedProducts;
        });
    };
    const generate = async () => {
        try {
            const total = products.reduce((acc, product) => acc + product.total, 0);
            const gstPercentage = 18;
            const gst = (total * gstPercentage) / 100;
            const grandTotal = total + gst;


            const currentDate = new Date();
            const validUntil = currentDate.toISOString().split('T')[0];
            const userId = auth?.user?._id;

            const bill = {
                arr: products,
                Total: total,
                GST: `${gstPercentage}%`,
                'Grand-Total': grandTotal,
                'valid-until': validUntil,
                Title: "Invoice Generator",

            };

            const response = await axios.post('/api/generate-pdf', { userId, ...bill }, {
                responseType: 'blob', // Set the response type to 'blob'
            });

            // Create a Blob from the response data
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // Create a URL for the Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Open the PDF in a new window or tab
            window.open(pdfUrl, '_blank');
            console.log('PDF generated and opened in a new tab');
        } catch (error) {
            console.error('Error generating or retrieving PDF:', error);
        }



    }
    const handleLogout = () => {
        // Remove the authentication state
        setAuth({ user: null, token: '' });

        // Remove the authentication data from local storage
        localStorage.removeItem('auth');
        navigate('/signin');
    };

    return (
        <>
            <div className="flex justify-between p-4 bg-blue-500 text-white mb-4">
                <div>
                    <h1 className="text-lg font-bold">Invoice Generator</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                >
                    Logout
                </button>
            </div>

            <div>
                <div className="mb-4 flex flex-col md:flex-row mx-auto">
                    <div className="mb-4 md:mr-2">
                        <label className="block text-sm font-bold text-gray-700">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full md:w-40 px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4 md:mr-2">
                        <label className="block text-sm font-bold text-gray-700">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                            className="w-full md:w-20 px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4 md:mr-2">
                        <label className="block text-sm font-bold text-gray-700">Rate</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(parseInt(e.target.value, 10))}
                            className="w-full md:w-20 px-3 py-2 border rounded-md"
                        />
                    </div>
                </div>
                <button
                    onClick={addProduct}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add Product
                </button>

                <table className="mt-8 w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Product Name</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Rate</th>
                            <th className="border px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2">{product.quantity}</td>
                                <td className="border px-4 py-2">{product.rate}</td>
                                <td className="border px-4 py-2">{product.total}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => deleteProduct(index)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={generate}
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-5 mb-3"

                >
                    Generate PDF
                </button>

            </div>
        </>
    );
}

export default HomePage;