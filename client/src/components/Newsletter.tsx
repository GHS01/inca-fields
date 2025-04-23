import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { insertSubscriberSchema } from '@shared/schema';
import { Send, Bell, CalendarDays, GiftIcon } from 'lucide-react';

const subscriberSchema = insertSubscriberSchema.extend({
  email: z.string().email("Por favor, introduce un email válido")
});

type FormValues = z.infer<typeof subscriberSchema>;

type BenefitProps = {
  icon: React.ReactNode;
  title: string;
  delay: number;
};

const NewsletterBenefit = ({ icon, title, delay }: BenefitProps) => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-[#2D5C34]">{icon}</div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </motion.div>
  );
};

const Newsletter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      return apiRequest('POST', '/api/subscribe', values);
    },
    onSuccess: () => {
      toast({
        title: "¡Gracias por suscribirte!",
        description: "Te hemos enviado un email de confirmación.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al procesar tu suscripción.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <section className="py-28 bg-[#F9F6F0] relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C6A96C' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="rounded-md border border-[#C6A96C]/30 bg-white shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image column */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" 
                  alt="Recetas con aguacate" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-20 max-w-xs text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-3xl font-display font-bold mb-4 text-shadow">Descubre el Mundo del Aguacate</h3>
                    <p className="text-white/90 font-body mb-6 text-shadow">
                      Únete a nuestra comunidad y descubre recetas exclusivas con nuestros aguacates premium.
                    </p>
                    <div className="h-1 w-20 bg-[#C6A96C]"></div>
                  </motion.div>
                </div>
              </div>
              
              {/* Form column */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-2">
                  <motion.span 
                    className="inline-block text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Exclusivo para suscriptores
                  </motion.span>
                </div>
                
                <motion.h2 
                  className="font-display text-3xl md:text-4xl font-bold text-[#2D5C34] mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Únete a Nuestra <span className="text-[#C6A96C]">Newsletter</span>
                </motion.h2>
                
                <motion.p 
                  className="font-body text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Recibe recetas exclusivas, consejos de nutrición y ofertas especiales directamente en tu bandeja de entrada.
                </motion.p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <NewsletterBenefit 
                    icon={<Bell size={16} />} 
                    title="Ofertas exclusivas solo para suscriptores" 
                    delay={0.4} 
                  />
                  <NewsletterBenefit 
                    icon={<CalendarDays size={16} />} 
                    title="Noticias de eventos y lanzamientos" 
                    delay={0.5} 
                  />
                  <NewsletterBenefit 
                    icon={<GiftIcon size={16} />} 
                    title="Regalos sorpresa para miembros" 
                    delay={0.6} 
                  />
                  <NewsletterBenefit 
                    icon={<Send size={16} />} 
                    title="Cancelación fácil en cualquier momento" 
                    delay={0.7} 
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="relative border-b border-gray-300 focus-within:border-[#C6A96C] transition-colors duration-300 mb-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Ingresa tu correo electrónico"
                                  className="border-none shadow-none focus:ring-0 px-0 py-3 bg-transparent focus:placeholder:text-[#C6A96C]/70 text-[#2D5C34]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <p className="font-body text-gray-500 text-xs">
                          * Puedes darte de baja en cualquier momento
                        </p>
                        
                        <Button 
                          type="submit" 
                          className="luxury-button bg-green force-dark-text inline-flex items-center gap-2"
                          disabled={mutation.isPending}
                        >
                          <span>{mutation.isPending ? "Procesando..." : "Suscribirse"}</span>
                          {!mutation.isPending && <Send size={14} />}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
