"""
Vidéo Manim — Les Tons du Kisakata
« La rivière qui chante » — Comment le ton change le sens des mots

Design system "Brume de la Rivière" (Sakata)
"""

from manim import *

# Palette Brume de la Rivière
BG = "#0A1F15"          # foret-nocturne
GOLD = "#C4A035"         # or-ancestral
BRIGHT_GOLD = "#E9C46A"  # or-vif
MIST = "#D4DDD7"         # brume-matinale
IVORY = "#F0EDE5"        # ivoire-ancien
AMBER = "#E8C670"        # amber-light
DARK_WATER = "#0C2920"   # eau-sombre
WARM = "#B59551"         # or-gold

MONO = "Menlo"

class Scene1_Intro(Scene):
    """Introduction : la rivière Lukenie et la langue Kisakata."""
    def construct(self):
        self.camera.background_color = BG

        # Fond brumeux — orbes flottants
        mists = VGroup()
        for _ in range(8):
            mist = Circle(radius=0.8 + random.random() * 1.5, fill_opacity=0.03 + random.random() * 0.04)
            mist.set_fill(MIST)
            mist.set_stroke(width=0)
            mist.move_to(np.array([random.uniform(-6, 6), random.uniform(-3, 3), 0]))
            mists.add(mist)
        self.add(mists)
        for mist in mists:
            mist.add_updater(lambda m, dt: m.shift(UP * 0.15 * dt + RIGHT * 0.08 * dt))

        # Titre
        title = Text("Les Tons du Kisakata", font_size=52, color=IVORY, weight=BOLD, font=MONO)
        subtitle = Text("La rivière qui chante", font_size=28, color=GOLD, font=MONO)

        VGroup(title, subtitle).arrange(DOWN, buff=0.3)

        # Animation
        self.add_subcaption("Les mots chantent comme la rivière", duration=3)
        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(subtitle, shift=UP * 0.3), run_time=1.0)
        self.wait(1.5)

        # Citation
        quote = Text(
            '"Dans la langue de nos ancêtres,\nla voix monte et descend\ncomme la Lukenie."',
            font_size=20, color=MIST, font=MONO, line_spacing=1.3
        )
        quote.to_edge(DOWN, buff=1.0)
        self.play(FadeIn(quote, shift=UP * 0.5), run_time=2.0)
        self.wait(2.0)

        self.play(FadeOut(VGroup(title, subtitle, quote, *mists)), run_time=1.0)


class Scene2_Concept(Scene):
    """Explication : qu'est-ce qu'un ton ?"""
    def construct(self):
        self.camera.background_color = BG

        # Ligne de rivière ondulante
        river = FunctionGraph(
            lambda x: 0.4 * np.sin(2 * x) + 0.2 * np.sin(4 * x),
            x_range=[-6, 6],
            color=GOLD,
            stroke_width=3,
        )

        # Étiquettes
        haut_label = Text("Ton Haut ↗", font_size=22, color=BRIGHT_GOLD, font=MONO)
        bas_label = Text("Ton Bas ↘", font_size=22, color=WARM, font=MONO)

        haut_label.next_to(river, UP, buff=0.8).shift(LEFT * 2)
        bas_label.next_to(river, DOWN, buff=0.8).shift(RIGHT * 2)

        # Flèches
        arrow_up = Arrow(start=haut_label.get_bottom(), end=river.get_top() + LEFT * 1.5, color=BRIGHT_GOLD, buff=0.1)
        arrow_down = Arrow(start=bas_label.get_top(), end=river.get_bottom() + RIGHT * 1.5, color=WARM, buff=0.1)

        # Animation
        self.add_subcaption("Le Kisakata est une langue tonale", duration=4)
        self.play(Create(river), run_time=2.0)
        self.play(
            Write(haut_label),
            Write(bas_label),
            GrowArrow(arrow_up),
            GrowArrow(arrow_down),
            run_time=2.5
        )
        self.wait(2.0)

        # Question
        question = Text(
            "Le même mot peut avoir 2 sens différents\nselon que la voix monte ou descend.",
            font_size=20, color=MIST, font=MONO, line_spacing=1.4
        )
        question.to_edge(DOWN, buff=1.0)
        self.play(Write(question), run_time=2.5)
        self.wait(2.5)

        self.play(FadeOut(VGroup(river, haut_label, bas_label, arrow_up, arrow_down, question)), run_time=1.0)


class Scene3_Examples(Scene):
    """Exemples concrets de paires tonales."""
    def construct(self):
        self.camera.background_color = BG

        pairs = [
            ("Mbóte", "Bonjour (ton haut)", BRIGHT_GOLD, "👋"),
            ("Mboté", "Salutation (ton bas)", WARM, "🙏"),
            ("Kókó", "Grand-mère (ton haut)", BRIGHT_GOLD, "👵"),
            ("Kokó", "Poule (ton bas)", WARM, "🐔"),
        ]

        title = Text("Les Paires Tonales", font_size=42, color=IVORY, weight=BOLD, font=MONO)
        title.to_edge(UP, buff=0.8)
        self.play(Write(title), run_time=1.0)
        self.add_subcaption("Le ton change le sens — des exemples", duration=6)

        for i in range(0, len(pairs), 2):
            if i > 0:
                self.play(FadeOut(VGroup(*self.mobjects, title)), run_time=0.5)
                self.play(Write(title), run_time=0.3)

            mot1, sens1, color1, emoji1 = pairs[i]
            mot2, sens2, color2, emoji2 = pairs[i + 1]

            # Mot 1 (gauche)
            big_word1 = Text(mot1, font_size=64, color=color1, weight=BOLD, font=MONO)
            meaning1 = Text(sens1, font_size=22, color=MIST, font=MONO)
            emoji_text1 = Text(emoji1, font_size=48)

            left_group = VGroup(big_word1, meaning1, emoji_text1).arrange(DOWN, buff=0.3)
            left_group.shift(LEFT * 3.5)

            # Mot 2 (droite)
            big_word2 = Text(mot2, font_size=64, color=color2, weight=BOLD, font=MONO)
            meaning2 = Text(sens2, font_size=22, color=MIST, font=MONO)
            emoji_text2 = Text(emoji2, font_size=48)

            right_group = VGroup(big_word2, meaning2, emoji_text2).arrange(DOWN, buff=0.3)
            right_group.shift(RIGHT * 3.5)

            # Flèche tonale
            arrow_up = CurvedArrow(
                left_group.get_right() + RIGHT * 0.3 + UP * 0.3,
                right_group.get_left() + LEFT * 0.3 + UP * 0.3,
                angle=-0.5,
                color=color1,
            )
            arrow_down = CurvedArrow(
                right_group.get_left() + LEFT * 0.3 + DOWN * 0.3,
                left_group.get_right() + RIGHT * 0.3 + DOWN * 0.3,
                angle=0.5,
                color=color2,
            )

            self.play(
                FadeIn(left_group, shift=RIGHT * 0.5),
                FadeIn(right_group, shift=LEFT * 0.5),
                run_time=1.5
            )
            self.play(Create(arrow_up), Create(arrow_down), run_time=1.5)
            self.wait(2.5)

        self.play(FadeOut(VGroup(*self.mobjects)), run_time=1.0)


class Scene4_Musicalite(Scene):
    """La musicalité de la langue — conclusion poétique."""
    def construct(self):
        self.camera.background_color = BG

        # Vague de particules dorées qui montent
        particles = VGroup()
        for i in range(30):
            dot = Dot(
                point=np.array([random.uniform(-6, 6), -3.5, 0]),
                radius=0.04,
                color=random.choice([GOLD, BRIGHT_GOLD, AMBER, WARM])
            )
            dot.add_updater(
                lambda d, dt, seed=random.random(): d.shift(
                    UP * (0.6 + 0.4 * np.sin(seed * 5 + d.get_center()[0] * 0.5)) * dt
                    + RIGHT * 0.1 * np.sin(seed * 3 + d.get_center()[0] * 0.5) * dt
                )
            )
            particles.add(dot)

        self.add(particles)
        self.add_subcaption("La langue est une rivière — chaque ton est un courant", duration=5)

        # Texte final
        final = Text(
            "Le Kisakata n'est pas une langue à lire,\nc'est une langue à chanter.",
            font_size=28, color=IVORY, font=MONO, line_spacing=1.4
        )
        self.play(Write(final), run_time=2.5)
        self.wait(3.0)

        # Signature
        sign = Text("— Sakata • Les Murmures de la Lukenie", font_size=16, color=MIST, font=MONO)
        sign.to_edge(DOWN, buff=1.0)
        self.play(FadeIn(sign, shift=UP * 0.3), run_time=1.5)
        self.wait(3.0)

        self.play(FadeOut(VGroup(final, sign, *particles)), run_time=1.0)
