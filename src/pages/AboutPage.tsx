import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Users, Target, Zap, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <section className="py-12">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 font-display text-4xl font-bold uppercase text-foreground md:text-5xl">
              О проекте <span className="text-primary">SportNews</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Ваш надёжный источник спортивных новостей
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg mx-auto mb-12 max-w-none text-muted-foreground"
          >
            <p className="text-lg leading-relaxed">
              <strong className="text-foreground">SportNews</strong> — это современный спортивный портал, 
              созданный для настоящих фанатов спорта. Мы собираем и анализируем новости со всего мира, 
              чтобы вы всегда были в курсе главных событий в мире футбола, баскетбола, хоккея, 
              тенниса, автоспорта и единоборств.
            </p>
            <p className="text-lg leading-relaxed">
              Наша команда использует передовые технологии искусственного интеллекта для обработки 
              и подготовки материалов, что позволяет оперативно доставлять вам качественный контент 
              24 часа в сутки, 7 дней в неделю.
            </p>
          </motion.div>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Zap,
                title: "Оперативность",
                description: "Новости обновляются автоматически каждый день. Вы узнаете о событиях одними из первых.",
              },
              {
                icon: Target,
                title: "Качество",
                description: "Каждая новость проходит обработку и редактирование для максимальной информативности.",
              },
              {
                icon: Globe,
                title: "Охват",
                description: "Мы следим за событиями во всех популярных видах спорта по всему миру.",
              },
              {
                icon: Users,
                title: "Для болельщиков",
                description: "Портал создан фанатами для фанатов. Мы понимаем, что важно именно вам.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="rounded-lg border border-border bg-secondary/30 p-6"
              >
                <item.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center"
          >
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
              Связаться с нами
            </h2>
            <p className="mb-4 text-muted-foreground">
              Есть вопросы, предложения или хотите сотрудничать? Напишите нам!
            </p>
            <a
              href="https://t.me/ivan_nogdanov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Написать в Telegram
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
