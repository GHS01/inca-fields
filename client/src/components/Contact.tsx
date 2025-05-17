import { useState, useEffect } from 'react';
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
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { insertContactSchema } from '@shared/schema';
import { initEmailJS, sendEmail } from '@/services/emailService';

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

const ContactItem = ({
  icon,
  title,
  content,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start mb-8 hover:transform hover:translate-x-2 transition-transform duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-10 h-10 border border-[#C6A96C] flex items-center justify-center text-[#C6A96C] mr-4 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl font-bold mb-1">{title}</h3>
        <p className="font-body text-white/80">{content}</p>
      </div>
    </motion.div>
  );
};

const SocialLink = ({
  icon,
  href,
  delay
}: {
  icon: React.ReactNode;
  href: string;
  delay: number;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 border border-[#C6A96C] flex items-center justify-center text-[#C6A96C] hover:bg-[#C6A96C] hover:text-white transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {icon}
    </motion.a>
  );
};

const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" });
  const { toast } = useToast();

  // Inicializar EmailJS cuando el componente se monta
  useEffect(() => {
    initEmailJS();
  }, []);

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

  // Mutación para enviar el formulario usando EmailJS
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        // Primero intentamos enviar por correo electrónico usando EmailJS
        const emailResult = await sendEmail({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message
        });

        if (!emailResult.success) {
          throw new Error(emailResult.message);
        }

        // Si el envío por correo fue exitoso, también guardamos en el backend como respaldo
        try {
          await apiRequest('POST', '/api/contact', values);
        } catch (backendError) {
          console.warn('No se pudo guardar el contacto en el backend, pero el correo se envió correctamente:', backendError);
          // No lanzamos error aquí porque el correo ya se envió correctamente
        }

        return emailResult;
      } catch (error) {
        // Si falla EmailJS, intentamos el método de respaldo usando solo el backend
        console.warn('Error al enviar por EmailJS, intentando método de respaldo:', error);
        await apiRequest('POST', '/api/contact', values);
        return { success: true, message: "Mensaje recibido. Te contactaremos pronto." };
      }
    },
    onSuccess: (result) => {
      toast({
        title: "Mensaje enviado",
        description: result.message || "Gracias por tu mensaje. Te contactaremos pronto.",
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
    <section id="contact" className="py-28 bg-[#2D5C34] text-white relative" ref={ref}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E')] bg-fixed"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <motion.div
              className="inline-flex items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
              <span className="text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light">Estamos Para Servirte</span>
              <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
            </motion.div>

            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contacta con <span className="text-[#C6A96C]">Nosotros</span>
            </motion.h2>

            <motion.p
              className="font-body text-white/80 text-lg max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ¿Tienes alguna pregunta o estás interesado en nuestros productos premium?
              Nuestro equipo especializado está listo para ayudarte.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="border-l border-[#C6A96C]/30 pl-8 h-full flex flex-col">
                <ContactItem
                  icon={<MapPin size={18} />}
                  title="Oficina Central"
                  content="Av. Agricultura 1250, Lima, Perú"
                  delay={0.3}
                />

                <ContactItem
                  icon={<Phone size={18} />}
                  title="Teléfono"
                  content="+51 123 456 789"
                  delay={0.4}
                />

                <ContactItem
                  icon={<Mail size={18} />}
                  title="Email"
                  content="info@incafields.com"
                  delay={0.5}
                />

                <ContactItem
                  icon={<Clock size={18} />}
                  title="Horario de Atención"
                  content="Lunes a Viernes: 9:00 AM - 6:00 PM"
                  delay={0.6}
                />

                <div className="mt-auto">
                  <motion.h3
                    className="font-display text-xl font-bold mb-6 mt-10"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    Síguenos en Redes
                  </motion.h3>

                  <div className="flex space-x-4">
                    <SocialLink
                      icon={<Facebook size={18} />}
                      href="https://facebook.com/incafields"
                      delay={0.8}
                    />
                    <SocialLink
                      icon={<Instagram size={18} />}
                      href="https://instagram.com/incafields"
                      delay={0.85}
                    />
                    <SocialLink
                      icon={<Twitter size={18} />}
                      href="https://twitter.com/incafields"
                      delay={0.9}
                    />
                    <SocialLink
                      icon={<Linkedin size={18} />}
                      href="https://linkedin.com/company/incafields"
                      delay={0.95}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2" ref={formRef}>
              <Form {...form}>
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#C6A96C]/20"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#C6A96C]/20"></div>

                  <motion.h3
                    className="font-display text-2xl font-bold mb-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Envíanos un Mensaje
                    <div className="h-[1px] w-16 bg-[#C6A96C] mt-4"></div>
                  </motion.h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-sm uppercase tracking-wider mb-2 text-white/80">Nombre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              className="border-white/10 bg-white/5 focus:ring-1 focus:ring-[#C6A96C] focus:border-[#C6A96C] transition-colors duration-300 placeholder:text-white/40 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body text-sm uppercase tracking-wider mb-2 text-white/80">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              className="border-white/10 bg-white/5 focus:ring-1 focus:ring-[#C6A96C] focus:border-[#C6A96C] transition-colors duration-300 placeholder:text-white/40 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="font-body text-sm uppercase tracking-wider mb-2 text-white/80">Asunto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Asunto de tu mensaje"
                            className="border-white/10 bg-white/5 focus:ring-1 focus:ring-[#C6A96C] focus:border-[#C6A96C] transition-colors duration-300 placeholder:text-white/40 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel className="font-body text-sm uppercase tracking-wider mb-2 text-white/80">Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tu mensaje aquí..."
                            rows={5}
                            className="border-white/10 bg-white/5 focus:ring-1 focus:ring-[#C6A96C] focus:border-[#C6A96C] transition-colors duration-300 placeholder:text-white/40 text-white resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptedPrivacy"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 mb-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/30 data-[state=checked]:bg-[#C6A96C] data-[state=checked]:border-[#C6A96C] focus:ring-1 focus:ring-[#C6A96C]"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-body text-sm text-white/70">
                            Acepto la política de privacidad y el tratamiento de mis datos personales según la política de privacidad.
                          </FormLabel>
                          <FormMessage className="text-red-300" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="luxury-button bg-[#C6A96C] text-white border-[#C6A96C] inline-flex items-center gap-2"
                      disabled={mutation.isPending}
                    >
                      <span>{mutation.isPending ? "Enviando..." : "Enviar Mensaje"}</span>
                      {!mutation.isPending && <Send size={16} />}
                    </Button>
                  </div>
                </motion.form>
              </Form>
            </div>
          </div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <a
              href="https://www.google.com/maps/place/Lima,+Perú"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C6A96C] hover:text-white/90 transition-colors duration-300"
            >
              <span>Ver Nuestra Ubicación en el Mapa</span>
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
