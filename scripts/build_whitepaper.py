from pathlib import Path
from io import BytesIO

from PIL import Image
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "palmwatch-whitepaper.pdf"
PUBLIC = ROOT / "public" / "assets" / "palmwatch-whitepaper.pdf"
HERO = ROOT / "public" / "assets" / "palmwatch-hero.png"
FIELD = ROOT / "public" / "assets" / "palmwatch-field-verification.png"

W, H = A4
FOREST = HexColor("#082B26")
FOREST_2 = HexColor("#17483E")
LIME = HexColor("#DFF542")
SURFACE = HexColor("#F3F4EF")
GREEN_GREY = HexColor("#DCE4DC")
MUTED = HexColor("#596B65")
WHITE = HexColor("#FFFFFF")
AMBER = HexColor("#D7B36A")


def register_fonts():
    candidates = [
        ("C:/Windows/Fonts/arial.ttf", "PalmSans"),
        ("C:/Windows/Fonts/arialbd.ttf", "PalmSans-Bold"),
    ]
    for path, name in candidates:
        if Path(path).exists():
            pdfmetrics.registerFont(TTFont(name, path))
    return "PalmSans" if "PalmSans" in pdfmetrics.getRegisteredFontNames() else "Helvetica"


FONT = register_fonts()
BOLD = "PalmSans-Bold" if "PalmSans-Bold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold"


def paragraph(c, text, x, y, width, size=10, leading=14, color=FOREST, font=FONT):
    style = ParagraphStyle("body", fontName=font, fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT)
    p = Paragraph(text, style)
    _, ph = p.wrap(width, H)
    p.drawOn(c, x, y - ph)
    return ph


def cover_image(c, path, x, y, width, height):
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = max(width / iw, height / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    c.rect(x, y, width, height, stroke=0, fill=0)
    c.clipPath(c.beginPath())
    c.drawImage(image, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh, mask="auto")
    c.restoreState()


def image_crop(c, path, x, y, width, height):
    with Image.open(path) as source:
        source.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        source.convert("RGB").save(buffer, format="JPEG", quality=86, optimize=True)
        buffer.seek(0)
    image = ImageReader(buffer)
    iw, ih = image.getSize()
    scale = max(width / iw, height / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, width, height)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(image, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh, mask="auto")
    c.restoreState()


def header(c, section, page):
    c.setFillColor(FOREST)
    c.setFont(BOLD, 9)
    c.drawString(42, H - 38, "PALMWATCH")
    c.setFont(FONT, 8)
    c.setFillColor(MUTED)
    c.drawRightString(W - 42, H - 38, section.upper())
    c.setStrokeColor(Color(0.03, 0.17, 0.15, alpha=.16))
    c.line(42, H - 50, W - 42, H - 50)
    c.setFont(FONT, 8)
    c.drawString(42, 28, "Evidence-led oil-palm intelligence")
    c.drawRightString(W - 42, 28, f"{page:02d}")


def title(c, kicker, heading, intro=None):
    c.setFillColor(MUTED)
    c.setFont(BOLD, 8)
    c.drawString(42, H - 86, kicker.upper())
    y = H - 112
    h = paragraph(c, heading, 42, y, W - 84, size=27, leading=29, color=FOREST, font=BOLD)
    if intro:
        paragraph(c, intro, 42, y - h - 16, W - 110, size=10.5, leading=15, color=MUTED)


def rounded_box(c, x, y, w, h, fill, radius=12, stroke=None):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.roundRect(x, y, w, h, radius, stroke=1, fill=1)
    else:
        c.roundRect(x, y, w, h, radius, stroke=0, fill=1)


def page_cover(c):
    image_crop(c, HERO, 0, 0, W, H)
    c.setFillColor(Color(0.02, 0.13, 0.11, alpha=.74))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(LIME)
    c.circle(62, H - 67, 18, stroke=0, fill=1)
    c.setStrokeColor(FOREST)
    c.setLineWidth(2.2)
    c.line(54, H - 73, 70, H - 58)
    c.line(57, H - 67, 70, H - 58)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 15)
    c.drawString(90, H - 73, "PalmWatch")
    c.setFillColor(LIME)
    c.setFont(BOLD, 9)
    c.drawString(52, H - 224, "WHITE PAPER / VERSION 2.0")
    paragraph(c, "Satellite-to-field<br/>oil-palm intelligence", 52, H - 258, W - 104, size=36, leading=38, color=WHITE, font=BOLD)
    paragraph(c, "An evidence-led framework for connecting repeat satellite context, targeted drone mapping, palm-level history, and field confirmation.", 52, H - 385, 400, size=13, leading=19, color=WHITE)
    rounded_box(c, 52, 75, W - 104, 82, Color(1, 1, 1, alpha=.92), 16)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 11)
    c.drawString(70, 126, "Designed for estate teams, agronomists, and research partners")
    c.setFillColor(MUTED)
    c.setFont(FONT, 9)
    c.drawString(70, 102, "Screening supports expert review; it does not replace field or laboratory confirmation.")
    c.drawString(70, 84, "September 2026  |  palmwatch.in")
    c.showPage()


def page_summary(c):
    header(c, "Executive summary", 2)
    title(c, "Why PalmWatch", "A continuous record from estate to palm.", "PalmWatch uses repeat satellite observations for broad context, targeted drone surveys for closer evidence, and field findings for confirmation.")
    y = 520
    cards = [
        ("01", "Identity before inference", "Every mapped palm receives a stable identifier, baseline, and time-linked observation history."),
        ("02", "Two observation scales", "Satellite time series screen broad change; drone surveys add selective crown-level detail."),
        ("03", "Verification closes the loop", "Field findings and, when required, laboratory confirmation remain attached to the record."),
    ]
    for number, heading, body in cards:
        rounded_box(c, 42, y - 105, W - 84, 92, GREEN_GREY, 14)
        c.setFillColor(FOREST)
        c.setFont(BOLD, 10)
        c.drawString(60, y - 41, number)
        c.setFont(BOLD, 15)
        c.drawString(100, y - 42, heading)
        paragraph(c, body, 100, y - 57, W - 175, size=9.5, leading=13, color=MUTED)
        y -= 112
    rounded_box(c, 42, 94, W - 84, 72, FOREST, 14)
    paragraph(c, "The first model target is a three-way screen: healthy, other stress, and suspected Ganoderma. More detailed labels require sufficient confirmed samples.", 60, 143, W - 120, size=10, leading=14, color=WHITE, font=BOLD)
    c.showPage()


def page_study(c):
    header(c, "Proposed study design", 3)
    title(c, "Minimum defensible scope", "Scale the evidence before scaling the claim.", "These figures are proposed targets for an expanded NBL study. They are not deployment results, accuracy claims, or completed observations.")
    stats = [("120", "balanced study farms"), ("6,000", "mapped palms"), ("3", "repeat survey rounds"), ("18,000", "tree observations")]
    x0, y0, gap = 42, 430, 12
    cw = (W - 84 - gap) / 2
    for i, (value, label) in enumerate(stats):
        x = x0 + (i % 2) * (cw + gap)
        y = y0 - (i // 2) * 132
        rounded_box(c, x, y, cw, 116, LIME if i == 0 else GREEN_GREY, 14)
        c.setFillColor(FOREST)
        c.setFont(BOLD, 28)
        c.drawString(x + 18, y + 61, value)
        paragraph(c, label, x + 18, y + 47, cw - 36, size=9.5, leading=12, color=FOREST, font=BOLD)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 13)
    c.drawString(42, 159, "Design guardrails")
    bullets = [
        "Balance farms across geography, planting age, management, and observable stress contexts.",
        "Separate training, validation, and locked testing by farm - never randomly by tree.",
        "Repeat surveys to distinguish persistent decline from seasonal or flight-condition noise.",
    ]
    y = 138
    for item in bullets:
        c.setFillColor(LIME)
        c.circle(48, y - 3, 3, stroke=0, fill=1)
        paragraph(c, item, 60, y + 3, W - 110, size=9, leading=12.5, color=MUTED)
        y -= 31
    c.showPage()


def page_evidence(c):
    header(c, "Evidence architecture", 4)
    title(c, "Signal families", "Useful screening begins when evidence agrees.", "No universal vegetation-index threshold can diagnose a palm. PalmWatch combines calibrated measurements, local comparison, temporal change, and confirmed field labels.")
    families = [
        ("Spectral", "NDVI, NDRE, GNDVI, red edge, NIR, and calibrated reflectance."),
        ("Structural", "Crown area, density, symmetry, visible gaps, yellowing, and change over time."),
        ("Thermal", "Canopy temperature, transpiration stress, and neighbour-relative anomalies."),
        ("Contextual", "Soil, weather, age, seed, irrigation, fertilizer, infestation, and management history."),
    ]
    y = 508
    for i, (name, body) in enumerate(families):
        fill = FOREST if i in (0, 3) else GREEN_GREY
        color = WHITE if i in (0, 3) else FOREST
        rounded_box(c, 42, y - 96, W - 84, 84, fill, 14)
        c.setFillColor(LIME if color == WHITE else FOREST)
        c.setFont(BOLD, 9)
        c.drawString(60, y - 39, f"0{i + 1}")
        c.setFillColor(color)
        c.setFont(BOLD, 15)
        c.drawString(100, y - 40, name)
        paragraph(c, body, 100, y - 54, W - 172, size=9.2, leading=12.5, color=color)
        y -= 102
    rounded_box(c, 42, 72, W - 84, 54, LIME, 12)
    paragraph(c, "A flagged palm is a prioritised observation, not a diagnosis.", 60, 108, W - 120, size=11, leading=14, color=FOREST, font=BOLD)
    c.showPage()


def page_workflow(c):
    header(c, "Operating workflow", 5)
    title(c, "Five connected services", "From map to monitored outcome.", "Each service produces a traceable hand-off rather than an isolated dashboard event.")
    steps = [
        ("01", "Satellite watch", "Repeat estate-wide optical observations with weather, terrain, and soil context."),
        ("02", "Change screening", "Persistent block and neighbourhood trends enter a transparent review queue."),
        ("03", "Targeted drone survey", "Priority areas receive calibrated RGB, multispectral, and thermal capture."),
        ("04", "Field verification", "Agronomists inspect prioritised palms and attach findings."),
        ("05", "Monitor & report", "Follow-ups connect intervention, outcome, and estate-level reporting."),
    ]
    y = 505
    for i, (num, name, body) in enumerate(steps):
        c.setFillColor(LIME if i < 4 else AMBER)
        c.circle(62, y, 17, stroke=0, fill=1)
        c.setFillColor(FOREST)
        c.setFont(BOLD, 8)
        c.drawCentredString(62, y - 3, num)
        if i < 4:
            c.setStrokeColor(GREEN_GREY)
            c.setLineWidth(3)
            c.line(62, y - 18, 62, y - 70)
        c.setFillColor(FOREST)
        c.setFont(BOLD, 14)
        c.drawString(96, y + 5, name)
        paragraph(c, body, 96, y - 9, W - 150, size=9.2, leading=12.5, color=MUTED)
        y -= 82
    c.showPage()


def page_scale(c):
    header(c, "Satellite and drone evidence", 6)
    title(c, "Cross-scale monitoring", "Breadth first. Detail where it matters.", "Satellite and drone systems answer different questions. PalmWatch connects them without presenting either layer as a diagnosis.")
    rows = [
        ("Best use", "Repeat estate context", "Priority-block detail"),
        ("Coverage", "Large systematic footprints", "Selective flight areas"),
        ("Strength", "Temporal and spatial overview", "Closer spectral and structural evidence"),
        ("Limit", "Cloud and mixed pixels", "Calibration and flight-condition sensitivity"),
        ("Decision", "Where should we look?", "What should field teams review?"),
    ]
    x0, y0 = 42, 505
    widths = [105, 190, 174]
    labels = ["Question", "Satellite layer", "Drone layer"]
    c.setFillColor(FOREST)
    c.roundRect(x0, y0, sum(widths), 42, 10, stroke=0, fill=1)
    x = x0
    for label, width in zip(labels, widths):
        c.setFillColor(WHITE)
        c.setFont(BOLD, 9)
        c.drawString(x + 12, y0 + 16, label)
        x += width
    y = y0 - 57
    for label, sat, drone in rows:
        rounded_box(c, x0, y, sum(widths), 48, GREEN_GREY if int((y0-y)/57) % 2 else SURFACE, 8)
        x = x0
        for value, width in zip([label, sat, drone], widths):
            paragraph(c, value, x + 12, y + 33, width - 20, size=8.6, leading=11, color=FOREST, font=BOLD if x == x0 else FONT)
            x += width
        y -= 57
    rounded_box(c, 42, 98, W - 84, 84, FOREST, 14)
    paragraph(c, "Sentinel-2 provides 13 spectral bands at 10 m, 20 m, and 60 m native resolutions with a nominal five-day two-satellite revisit. Usable tropical observations can be less frequent because cloud and haze still matter.", 60, 158, W - 120, size=9.5, leading=14, color=WHITE)
    c.showPage()


def page_ganoderma(c):
    header(c, "Ganoderma impact", 7)
    title(c, "Yield exposure", "Per-acre loss needs assumptions, not slogans.", "Published figures describe specific study populations. Estate exposure depends on incidence, palm age, attainable yield, disease progress, price, and management response.")
    rounded_box(c, 42, 414, W - 84, 128, LIME, 16)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 28)
    c.drawString(62, 482, "0.016-1.76 t/acre")
    paragraph(c, "Approximate conversion of the 0.04-4.34 t/ha FFB reduction reported across 10- to 22-year plantings in a Johor case study.", 62, 460, W - 124, size=9.5, leading=13, color=FOREST)
    rounded_box(c, 42, 272, W - 84, 112, GREEN_GREY, 16)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 25)
    c.drawString(62, 331, "Up to 68%")
    paragraph(c, "A separate Bayesian model estimated loss relative to attainable yield among infected palms. It is not a whole-estate default.", 62, 310, W - 124, size=9.5, leading=13, color=FOREST)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 13)
    c.drawString(42, 228, "Transparent scenario formula")
    rounded_box(c, 42, 157, W - 84, 50, FOREST, 10)
    paragraph(c, "hectares x affected share x healthy FFB yield x yield-loss fraction", 60, 191, W - 120, size=10, leading=14, color=WHITE, font=BOLD)
    paragraph(c, "Revenue exposure may be estimated with a dated price per tonne, but it excludes treatment, mortality, replanting, delayed production, and recovery effects.", 42, 132, W - 84, size=9.2, leading=13, color=MUTED)
    c.showPage()


def page_validation(c):
    header(c, "Validation", 8)
    title(c, "Research discipline", "Build evidence that can survive a new farm.", "Validation should test whether the approach generalises across locations, seasons, and management contexts - not whether it remembers a familiar plantation.")
    columns = [
        ("Farm-level split", "Keep palms from one farm in only one of training, validation, or locked testing."),
        ("Repeat capture", "Use multiple survey rounds to test persistence and reduce one-flight noise."),
        ("Confirmed labels", "Retain expert observations and laboratory confirmation where required."),
        ("Transparent review", "Show the contributing signal families and relevant comparison context."),
    ]
    x0, y0, gap = 42, 433, 14
    cw = (W - 84 - gap) / 2
    for i, (name, body) in enumerate(columns):
        x = x0 + (i % 2) * (cw + gap)
        y = y0 - (i // 2) * 144
        rounded_box(c, x, y, cw, 128, GREEN_GREY if i != 3 else FOREST, 14)
        color = WHITE if i == 3 else FOREST
        c.setFillColor(color)
        c.setFont(BOLD, 14)
        c.drawString(x + 18, y + 88, name)
        paragraph(c, body, x + 18, y + 71, cw - 36, size=9.2, leading=13, color=color)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 13)
    c.drawString(42, 150, "Initial evaluation questions")
    paragraph(c, "Can the screen separate healthy palms, other stress, and suspected Ganoderma? Does performance hold on farms never seen during training? Are prioritised cases explainable and operationally reviewable?", 42, 130, W - 84, size=9.5, leading=14, color=MUTED)
    c.showPage()


def page_outputs(c):
    header(c, "Outputs and limits", 9)
    title(c, "What teams receive", "Decision support with an audit trail.", "The platform is designed to keep the estate view connected to the palm, observation, assignment, and field outcome.")
    image_crop(c, FIELD, 42, 316, 220, 210)
    rounded_box(c, 278, 316, W - 320, 210, FOREST, 14)
    outputs = ["Palm identity and survey history", "Explainable review queue", "Field assignments and notes", "Repeat-monitoring reports"]
    y = 486
    for item in outputs:
        c.setFillColor(LIME)
        c.circle(298, y - 3, 3, stroke=0, fill=1)
        paragraph(c, item, 310, y + 3, W - 350, size=9.5, leading=13, color=WHITE, font=BOLD)
        y -= 40
    c.setFillColor(FOREST)
    c.setFont(BOLD, 14)
    c.drawString(42, 270, "Limitations stated plainly")
    limits = [
        "PalmWatch screens for elevated risk; field or laboratory confirmation remains essential.",
        "Thresholds and model behaviour must be calibrated to the study population and capture protocol.",
        "Detailed disease or severity labels are only defensible when confirmed sample counts support them.",
    ]
    y = 242
    for item in limits:
        rounded_box(c, 42, y - 47, W - 84, 40, SURFACE, 10)
        paragraph(c, item, 58, y - 18, W - 116, size=8.8, leading=12, color=MUTED)
        y -= 51
    c.showPage()


def page_references(c):
    header(c, "Selected references", 10)
    title(c, "Evidence register", "Sources behind the framework.", "PalmWatch separates published evidence, proposed study targets, and future deployment results.")
    references = [
        ("Roslan Abas & Idris Abu Seman (2012)", "Economic Impact of Ganoderma Incidence on Malaysian Oil Palm Plantation. MPOB Oil Palm Industry Economic Journal."),
        ("Kamu et al. (2021)", "Estimating the Yield Loss of Oil Palm Due to Ganoderma Basal Stem Rot Disease. Journal of Oil Palm Research. DOI: 10.21894/jopr.2020.0061"),
        ("Izzuddin et al. (2022)", "UAV-Based Remote Sensing for Early-Stage Detection of Ganoderma. Remote Sensing 14(5):1239."),
        ("European Space Agency (2026)", "Sentinel-2 facts and figures: 13 bands, 10/20/60 m spatial resolution, nominal five-day constellation revisit."),
        ("Szulczyk et al. (2020)", "Estimating the economic damage and treatment cost of basal stem rot. Forest Policy and Economics 116:102163."),
        ("Flood (2006)", "A Review of Fusarium Wilt of Oil Palm. Phytopathology 96(6):660-662."),
    ]
    y = 505
    for i, (name, detail) in enumerate(references):
        c.setFillColor(LIME if i % 2 == 0 else GREEN_GREY)
        c.circle(52, y + 3, 6, stroke=0, fill=1)
        c.setFillColor(FOREST)
        c.setFont(BOLD, 10)
        c.drawString(70, y + 8, name)
        paragraph(c, detail, 70, y - 7, W - 120, size=8.8, leading=12.5, color=MUTED)
        y -= 66
    rounded_box(c, 42, 76, W - 84, 62, FOREST, 12)
    paragraph(c, "Full links and continuously updated citations are available in the HTML white paper at palmwatch.in/white-paper/.", 60, 118, W - 120, size=9.5, leading=14, color=WHITE, font=BOLD)
    c.showPage()


def page_close(c):
    c.setFillColor(FOREST)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(LIME)
    c.setFont(BOLD, 9)
    c.drawString(52, H - 96, "NEXT STEP")
    paragraph(c, "Move from a visual demo to a validated field study.", 52, H - 132, W - 104, size=32, leading=35, color=WHITE, font=BOLD)
    paragraph(c, "A PalmWatch pilot should begin with protocol agreement, balanced sampling, farm-level data separation, and a field-confirmation workflow.", 52, H - 262, 420, size=12, leading=18, color=WHITE)
    rounded_box(c, 52, 228, W - 104, 160, GREEN_GREY, 16)
    c.setFillColor(FOREST)
    c.setFont(BOLD, 13)
    c.drawString(72, 350, "White paper scope")
    paragraph(c, "This document consolidates the current PalmWatch product narrative, proposed study targets, evidence architecture, service workflow, validation rules, outputs, and limitations. It contains no deployment performance or diagnostic-accuracy claim.", 72, 326, W - 144, size=10, leading=15, color=FOREST)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 10)
    c.drawString(52, 88, "https://palmwatch.in/white-paper/")
    c.setFont(FONT, 8)
    c.setFillColor(Color(1, 1, 1, alpha=.65))
    c.drawString(52, 66, "PalmWatch white paper  |  Version 2.0  |  September 2026")
    c.showPage()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("PalmWatch White Paper v2: Satellite-to-field oil-palm intelligence")
    c.setAuthor("PalmWatch")
    c.setSubject("Satellite monitoring, targeted drone mapping, field confirmation, and Ganoderma impact")
    page_cover(c)
    page_summary(c)
    page_study(c)
    page_evidence(c)
    page_workflow(c)
    page_scale(c)
    page_ganoderma(c)
    page_validation(c)
    page_outputs(c)
    page_references(c)
    page_close(c)
    c.save()
    PUBLIC.write_bytes(OUTPUT.read_bytes())
    print(f"Created {OUTPUT}")
    print(f"Published copy {PUBLIC}")


if __name__ == "__main__":
    build()
