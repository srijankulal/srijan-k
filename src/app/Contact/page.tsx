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
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.6,
                when: "beforeChildren" as const,
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 16, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };
    
    return (
        <motion.div 
            className="border border-border my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header whereAt='contact'/>
            <div className="px-2 sm:px-4 md:px-8">
                {/* Page header */}
                <div className="pt-24 pb-8 px-4">
                    <p className="section-label mb-1">// send message</p>
                    <h2 className="text-4xl sm:text-5xl font-bold">
                        <span className="text-neon">&gt;</span>CONTACT
                        <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                    </h2>
                    <p className="font-mono text-sm text-foreground/40 mt-2">
                        Fill in the form below and I&apos;ll get back to you.
                    </p>
                </div>

                <div className="flex justify-center items-start w-full pb-32">
                
                <motion.div 
                    className="relative w-full max-w-2xl border border-border bg-card/85 dark:bg-black/40 shadow-lg"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Terminal chrome */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-foreground/5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-neon/60" />
                        <span className="ml-3 font-mono text-xs text-foreground/40">send_message.sh</span>
                        <span className="ml-auto flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
                        </span>
                    </div>

                    <div className="p-5 sm:p-6">
                        {/* Prompt header */}
                        <motion.div variants={itemVariants} className="font-mono text-sm mb-5 text-foreground/60">
                            <span className="text-neon">srijan@portfolio</span>
                            <span className="text-blue-700 dark:text-blue-400"> ~/contacts</span>
                            <span className="text-foreground/40"> $ </span>
                            <span>./send_message.sh</span>
                        </motion.div>

                        <form
                            className="flex flex-col w-full gap-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <motion.div 
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row items-start justify-start w-full gap-4"
                            >
                                <div className="w-full sm:w-1/2">
                                    <label className="block mb-1.5 font-mono text-xs text-foreground/60">
                                        <span className="text-neon/70">&gt;</span> name:
                                    </label>
                                    <Input
                                        placeholder="Your name"
                                        className="w-full bg-background/80 dark:bg-white/5 border-border font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-neon/60 focus:ring-0 rounded-none"
                                        required
                                        {...register("name")}
                                    />
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <label className="block mb-1.5 font-mono text-xs text-foreground/60">
                                        <span className="text-neon/70">&gt;</span> email:
                                    </label>
                                    <Input
                                        placeholder="you@example.com"
                                        className="w-full bg-background/80 dark:bg-white/5 border-border font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-neon/60 focus:ring-0 rounded-none"
                                        required
                                        type="email"
                                        {...register("email")}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="block mb-1.5 font-mono text-xs text-foreground/60">
                                    <span className="text-neon/70">&gt;</span> message:
                                </label>
                                <Textarea
                                    placeholder="Hello there!"
                                    className="w-full bg-background/80 dark:bg-white/5 border-border font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-neon/60 focus:ring-0 rounded-none resize-none"
                                    required
                                    rows={5}
                                    {...register("message")}
                                />
                            </motion.div>

                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Button
                                    disabled={loading || isSubmitting}
                                    type="submit"
                                    className="w-full font-mono text-sm border border-neon/30 bg-neon/5 text-neon hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_20px_rgba(113,252,123,0.25)] disabled:opacity-40 mt-1 rounded-none transition-all duration-300"
                                >
                                    {loading 
                                        ? <span className="flex items-center gap-2"><LoaderIcon className="animate-spin h-4 w-4" /> Sending...</span>
                                        : "$ EXECUTE send_message.sh"
                                    }
                                </Button>
                            </motion.div>

                            {loading && (
                                <motion.div 
                                    className="text-xs font-mono text-neon/50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Processing request... please wait...
                                </motion.div>
                            )}
                        </form>
                    </div>
                </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
