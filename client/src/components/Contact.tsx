import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Phone, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { insertContactSchema } from '@shared/schema';

const contactSchema = insertContactSchema.extend({
  email: z.string().email("Por favor, introduce un email válido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  acceptedPrivacy: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la política de privacidad"
  })
});

type FormValues = z.infer<typeof contactSchema>;

const ContactItem = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="font-body">{content}</p>
      </div>
    </div>
  );
};

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      acceptedPrivacy: false
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      return apiRequest('POST', '/api/contact', values);
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por tu mensaje. Te contactaremos pronto.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <section id="contact" className="py-20 bg-[#2D5C34] text-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Contacta con Nosotros</h2>
            <p className="font-body text-lg mb-8">
              ¿Tienes alguna pregunta o estás interesado en nuestros productos premium? Nuestro equipo está listo para ayudarte.
            </p>
            
            <div className="mb-8">
              <ContactItem 
                icon={<MapPin size={24} />}
                title="Oficina Central"
                content="Av. Agricultura 1250, Lima, Perú"
              />
              
              <ContactItem 
                icon={<Phone size={24} />}
                title="Teléfono"
                content="+51 123 456 789"
              />
              
              <ContactItem 
                icon={<Mail size={24} />}
                title="Email"
                content="info@incafields.com"
              />
            </div>
            
            <div>
              <h3 className="font-display text-xl font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#2D5C34] transition-colors duration-300">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#2D5C34] transition-colors duration-300">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#2D5C34] transition-colors duration-300">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#2D5C34] transition-colors duration-300">
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="font-display text-2xl font-bold mb-6">Envíanos un Mensaje</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium mb-2">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre"
                            className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A96C] text-white placeholder:text-white placeholder:text-opacity-70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium mb-2">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A96C] text-white placeholder:text-white placeholder:text-opacity-70"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="font-body font-medium mb-2">Asunto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Asunto de tu mensaje"
                          className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A96C] text-white placeholder:text-white placeholder:text-opacity-70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="font-body font-medium mb-2">Mensaje</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tu mensaje aquí..."
                          rows={5}
                          className="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C6A96C] text-white placeholder:text-white placeholder:text-opacity-70 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acceptedPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex items-center mb-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mr-3 focus:ring-2 focus:ring-[#C6A96C]"
                        />
                      </FormControl>
                      <FormLabel className="font-body text-sm">
                        Acepto la política de privacidad y el tratamiento de mis datos.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#C6A96C] text-white font-body font-medium py-3 rounded-full shadow-md hover:bg-white hover:text-[#2D5C34] transition-all duration-300 btn-hover"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
