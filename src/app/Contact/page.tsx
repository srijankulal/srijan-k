"use client";

import { sendEmail } from "../../../server_actions/sendEmail";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast} from "sonner";
import { LoaderIcon } from "lucide-react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const ContactFormSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    message: z.string().min(1),
});

export default function Contact() {
    const [loading, setLoading] = useState(false);
    type FormData = {
        name: string;
        email: string;
        message: string;
    };
    
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm<FormData>();

    interface EmailResponse {
        success: boolean;
    }

    async function onSubmit(formData: FormData): Promise<void> {
        const validated = ContactFormSchema.safeParse(formData);
        if (!validated.success) {
            toast.error("Please fill in all the fields correctly.");
        } else {
            setLoading(true);
            const value: EmailResponse = await sendEmail(
                formData.name,
                formData.message,
                formData.email
            );
            if (value.success) {
                setLoading(false);
                toast.success("Your message has been sent successfully.");
            } else {
                setLoading(false);
                toast.error("An error occurred while sending your message.");
            }
        }
        reset();
    }
    
    return (
        <div className="border border-gray-300 p-4 my-4">
            <Header  whereAt='contact'/>
            <div className="text-center mb-6">
                <pre className="  text-xs lg:text-lg text-white ">
                    {`
   _____            _             _   
  / ____|          | |           | |  
 | |     ___  _ __ | |_ __ _  ___| |_ 
 | |    / _ \\| '_ \\| __/ _\  |/ __| __|
 | |___| (_) | | | | || (_| | (__| |_ 
  \\_____\\___/|_| |_|\\__\\__,_|\\___|\\___|
                                      
                                       
                                                  
                    `}
                </pre>
                <h2 className=" text-xl font-bold text-white">[CONTACT FORM]</h2>
            </div>
            <div className="flex justify-center items-center w-full snap-start sm:snap-align-none  pb-54">
            
            <div className="bg-background text-white p-4 border-2 border-white  shadow-lg w-full md:w-1/2">
                
                
                <form
                    className="flex flex-col w-full gap-3 "
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col items-start justify-start w-full gap-2 md:flex-row">
                        <div className="w-full md:w-1/2">
                            <label className="block mb-1 text-lg">&gt; name:</label>
                            <Input
                                placeholder="Nash Dan"
                                className="w-full  bg-background border-white text-white focus:border-white"
                                required
                                {...register("name")}
                            />
                        </div>

                        <div className="w-full md:w-1/2">
                            <label className="block mb-1 text-lg">&gt; email:</label>
                            <Input
                                placeholder="youremail@gmail.com"
                                className="w-full font-mono bg-background border-white text-white focus:border-white"
                                required
                                type="email"
                                {...register("email")}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">&gt; message:</label>
                        <Textarea
                            placeholder="Hello there!"
                            className="w-full font-mono bg-background border-white text-white focus:border-white"
                            required
                            rows={5}
                            {...register("message")}
                        />
                    </div>
                    <div>
                        <Button
                            disabled={loading || isSubmitting}
                            type="submit"
                            className="w-full font-mono border-2 border-white bg-background text-white hover:bg-green-900 disabled:opacity-50 mt-2"
                        >
                            {loading ? <LoaderIcon className="animate-spin" /> : "> EXECUTE SEND_MESSAGE.sh"}
                        </Button>
                    </div>
                    <div className="text-sm opacity-80 mt-2">
                        {loading && "Processing request... Please wait..."}
                    </div>
                    
                </form>
            </div>
            </div>
        </div>
    );
}

