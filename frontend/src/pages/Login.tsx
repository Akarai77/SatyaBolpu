import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Button from "../components/Button";
import { GrFormView, GrFormViewHide } from "react-icons/gr";

const Login = () => {
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: "",
        password: "",
    });

    const [errorList, setErrorList] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!formData.email.trim()) {
            newErrors.push("Email is required");
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push("Invalid email format");
        }

        if (!formData.password.trim()) {
            newErrors.push("Password is required");
        } else if (formData.password.length < 6) {
            newErrors.push("Password must be at least 6 characters");
        }

        return newErrors;
    };

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrorList((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrorList(validationErrors);
            return;
        }

        setErrorList([]);

    };

    return (
        <div className="w-full h-screen text-primary flex flex-col items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 h-3/4 border-4 border-white border-solid rounded-2xl
              flex flex-col items-center justify-evenly text-[2rem]"
            >
                <h1 className="text-[4rem] font-semibold">Login</h1>

                <div className="w-2/3 flex flex-col">
                    <label htmlFor="email">Email:</label>
                    <input
                        className="text-black p-2 text-[1.5rem] border-2 border-solid border-gray-300 rounded-md"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormDataChange}
                    />
                    {errorList.email && <p className="text-red-500 text-[1.2rem] mt-1">{errorList.email}</p>}
                </div>

                <div className="w-2/3 flex flex-col">
                    <label htmlFor="password" className="flex items-center justify-between">
                        Password:
                        <div
                            className="cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <GrFormViewHide /> : <GrFormView />}
                        </div>
                    </label>
                    <div className="w-full">
                        <input
                            className="text-black p-2 w-full text-[1.5rem] border-2 border-solid border-gray-300 rounded-md"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            ref={passwordRef}
                            value={formData.password}
                            onChange={handleFormDataChange}
                        />
                    </div>
                    {errorList.password && (
                        <p className="text-red-500 text-[1.2rem] mt-1">{errorList.password}</p>
                    )}
                </div>

                <Button className="text-[1.5rem]" type="submit" content="Login" />
            </form>
        </div>
    );
};

export default Login;

