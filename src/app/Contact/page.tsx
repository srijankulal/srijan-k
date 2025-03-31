"use client";

import { sendEmail } from "../../../server_actions/sendEmail";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast} from "sonner";
import { LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderFooter/Header";

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
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };
    
    return (
        <motion.div 
            className="border border-gray-300 p-4 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header whereAt='contact'/>
            <div className="text-center mb-6">
                <motion.pre 
                    className="text-xs lg:text-lg text-white"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring" }}
                >
                    {`
   _____            _             _   
  / ____|          | |           | |  
 | |     ___  _ __ | |_ __ _  ___| |_ 
 | |    / _ \\| '_ \\| __/ _\  |/ __| __|
 | |___| (_) | | | | || (_| | (__| |_ 
  \\_____\\___/|_| |_|\\__\\__,_|\\___|\\___|
                                      
                                       
                                                  
                    `}
                </motion.pre>
                <motion.h2 
                    className="text-xl font-bold text-white"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >[CONTACT FORM]</motion.h2>
            </div>
            <div className="flex justify-center items-center w-full snap-start sm:snap-align-none pb-54">
            
            <motion.div 
                className="bg-background text-white p-4 border-2 border-white shadow-lg w-full md:w-1/2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <form
                    className="flex flex-col w-full gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col items-start justify-start w-full gap-2 md:flex-row"
                    >
                        <div className="w-full md:w-1/2">
                            <label className="block mb-1 text-lg">&gt; name:</label>
                            <Input
                                placeholder="Nash Dan"
                                className="w-full bg-background border-white text-white focus:border-white"
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
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block mb-1 text-lg">&gt; message:</label>
                        <Textarea
                            placeholder="Hello there!"
                            className="w-full font-mono bg-background border-white text-white focus:border-white"
                            required
                            rows={5}
                            {...register("message")}
                        />
                    </motion.div>
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            disabled={loading || isSubmitting}
                            type="submit"
                            className="w-full font-mono border-2 border-white bg-background text-white hover:bg-green-900 disabled:opacity-50 mt-2"
                        >
                            {loading ? <LoaderIcon className="animate-spin" /> : "> EXECUTE SEND_MESSAGE.sh"}
                        </Button>
                    </motion.div>
                    <motion.div 
                        className="text-sm opacity-80 mt-2"
                        animate={{ opacity: loading ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loading && "Processing request... Please wait..."}
                    </motion.div>
                </form>
            </motion.div>
            </div>
        </motion.div>
    );
}
