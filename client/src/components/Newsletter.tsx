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

const subscriberSchema = insertSubscriberSchema.extend({
  email: z.string().email("Por favor, introduce un email válido")
});

type FormValues = z.infer<typeof subscriberSchema>;

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
    <section className="py-16 bg-[#F9F6F0]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-[#C6A96C] rounded-2xl p-8 md:p-12 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Únete a Nuestra Newsletter</h2>
              <p className="font-body text-white text-lg mb-6">
                Recibe recetas exclusivas, consejos de nutrición y ofertas especiales directamente en tu bandeja de entrada.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Tu email"
                            className="px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D5C34] w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-[#2D5C34] text-white px-8 py-3 rounded-full font-body font-medium shadow-md hover:bg-white hover:text-[#2D5C34] transition-all duration-300 btn-hover"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Procesando..." : "Suscribirse"}
                  </Button>
                </form>
              </Form>
              
              <p className="font-body text-white text-sm mt-4">
                Al suscribirte, aceptas nuestra política de privacidad. Puedes darte de baja en cualquier momento.
              </p>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" 
                alt="Recetas con aguacate" 
                className="rounded-xl shadow-lg max-h-80 object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
