// IELTS Writing prompts — used by the IELTS Writing Exam Mode.
// Each set has two tasks. Task 1 ~150 words, Task 2 ~250 words.
// 45 question sets per variant.

export type WritingVariant = "academic" | "general";

export type WritingTask = {
  /** Markdown-supported prompt. Tables allowed via simple HTML when needed. */
  prompt: string;
  /** Optional structured table to render alongside the prompt (Task 1 charts). */
  table?: { headers: string[]; rows: string[][] };
  minWords: number;
  minutesGuidance: number;
};

export type WritingQuestionSet = { id: string; task1: WritingTask; task2: WritingTask; };

export const IELTS_WRITING_PROMPTS: Record<WritingVariant, WritingQuestionSet[]> = {
  academic: [
    {
      id: "acad-1",
      task1: {
        prompt: "The table below shows the percentage of adults in the UK who used different online services in 2015, 2020 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Online Service", "2015", "2020", "2025"], rows: [["Online banking", "52%", "68%", "81%"], ["Online shopping", "61%", "76%", "88%"], ["Online learning", "18%", "42%", "67%"], ["Video streaming", "35%", "70%", "84%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people believe that online learning is better than classroom learning, while others think traditional classrooms are still more effective. Discuss both views and give your own opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-2",
      task1: {
        prompt: "The table below shows how people in one city travelled to work in 2010 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Transport Method", "2010", "2025"], rows: [["Car", "48%", "35%"], ["Bus", "22%", "25%"], ["Train", "15%", "21%"], ["Bicycle", "5%", "12%"], ["Walking", "10%", "7%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "In many countries, fewer young people are choosing to learn practical skills such as cooking, budgeting and basic home repairs. Why is this happening, and what problems can it cause?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-3",
      task1: {
        prompt: "The table below shows household electricity consumption by appliance in a typical UK home in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Appliance", "Share of use"], rows: [["Heating", "42%"], ["Hot water", "18%"], ["Lighting", "9%"], ["Cooking", "12%"], ["Appliances & electronics", "19%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people think governments should invest more in public transport, while others believe spending should go on building wider roads. Discuss both views and give your own opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-4",
      task1: {
        prompt: "The table below shows the number of international students enrolled in three UK universities between 2018 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["University", "2018", "2021", "2024"], rows: [["University A", "4,200", "5,800", "7,100"], ["University B", "3,100", "3,400", "4,900"], ["University C", "6,500", "6,200", "6,800"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many believe that university education should be free for everyone. Others say students should pay for their own studies. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-5",
      task1: {
        prompt: "The table below shows average monthly rent for a one-bedroom flat in four UK cities in 2020 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["City", "2020 (\u00a3)", "2025 (\u00a3)"], rows: [["London", "1,420", "1,890"], ["Manchester", "780", "1,150"], ["Bristol", "920", "1,310"], ["Leeds", "640", "980"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Children today spend much of their free time on screens. To what extent do you agree that this is harmful to their development?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-6",
      task1: {
        prompt: "The table below shows the proportion of household waste recycled, composted, incinerated or sent to landfill in 2010, 2017 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Method", "2010", "2017", "2024"], rows: [["Recycled", "27%", "42%", "48%"], ["Composted", "9%", "14%", "17%"], ["Incinerated", "12%", "18%", "22%"], ["Landfill", "52%", "26%", "13%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that art and music should be compulsory school subjects. Others say schools should focus only on academic subjects. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-7",
      task1: {
        prompt: "The table below shows daily water consumption per person in litres across four countries in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Litres per person"], rows: [["USA", "310"], ["Australia", "220"], ["UK", "145"], ["India", "135"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Working from home has become common in many industries. Do the advantages outweigh the disadvantages?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-8",
      task1: {
        prompt: "The table below shows the number of cinema tickets sold in a country (in millions) over five years.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Year", "Tickets sold (m)"], rows: [["2019", "168"], ["2020", "42"], ["2021", "94"], ["2022", "152"], ["2023", "174"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "It is sometimes said that international tourism creates tension rather than understanding between people from different cultures. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-9",
      task1: {
        prompt: "The table below shows the percentage of households owning selected electronic devices in 2005, 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Device", "2005", "2015", "2025"], rows: [["Smartphone", "8%", "78%", "96%"], ["Tablet", "2%", "45%", "68%"], ["Smart TV", "0%", "32%", "81%"], ["Smart speaker", "0%", "11%", "57%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people believe the best way to reduce crime is to give longer prison sentences. Others think there are better alternatives. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-10",
      task1: {
        prompt: "The table below shows CO2 emissions per capita (tonnes) for four countries in 2000 and 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "2000", "2022"], rows: [["USA", "20.8", "14.2"], ["Germany", "10.1", "7.9"], ["China", "2.7", "8.0"], ["India", "1.0", "1.9"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "In many countries, the gap between rich and poor is widening. What are the causes, and what measures can be taken to address this issue?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-11",
      task1: {
        prompt: "The table below shows employment by sector (%) in a developing country in 1990 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Sector", "1990", "2020"], rows: [["Agriculture", "62%", "28%"], ["Industry", "18%", "30%"], ["Services", "20%", "42%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some think the government should be responsible for caring for the elderly. Others believe families should take responsibility. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-12",
      task1: {
        prompt: "The table below shows the average daily calorie intake per person in four regions in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Region", "Calories/day"], rows: [["North America", "3,650"], ["Europe", "3,420"], ["Asia", "2,810"], ["Sub-Saharan Africa", "2,360"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Advances in technology have made many traditional jobs disappear. Is this a positive or negative development?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-13",
      task1: {
        prompt: "The table below shows the number of museum visitors (in thousands) to four major museums in one year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Museum", "Visitors (000s)"], rows: [["British Museum", "6,200"], ["Tate Modern", "5,100"], ["Louvre", "8,900"], ["Met (NYC)", "6,700"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people argue that zoos are cruel and should be closed. Others believe they play an important role in conservation. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-14",
      task1: {
        prompt: "The table below shows life expectancy at birth in five countries in 1980 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "1980", "2020"], rows: [["Japan", "76.1", "84.6"], ["UK", "73.7", "81.4"], ["USA", "73.7", "78.9"], ["Brazil", "62.5", "75.9"], ["Nigeria", "45.6", "54.3"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many cities are becoming overcrowded. What are the main problems caused by this, and how can they be solved?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-15",
      task1: {
        prompt: "The table below shows the percentage of energy produced from different sources in a country in 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Source", "2010", "2024"], rows: [["Coal", "41%", "12%"], ["Gas", "27%", "30%"], ["Nuclear", "19%", "17%"], ["Wind", "6%", "26%"], ["Solar", "1%", "11%"], ["Other renewables", "6%", "4%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some believe that children should start learning a foreign language at primary school. Others think they should wait until secondary school. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-16",
      task1: {
        prompt: "The table below shows smartphone ownership by age group (%) in 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Age Group", "2015", "2025"], rows: [["16\u201324", "82%", "99%"], ["25\u201344", "74%", "98%"], ["45\u201364", "48%", "92%"], ["65+", "19%", "71%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "It is often said that fast food is the main cause of rising obesity. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-17",
      task1: {
        prompt: "The table below shows the number of new cars sold in three regions (in millions) between 2018 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Region", "2018", "2021", "2024"], rows: [["Europe", "15.6", "11.8", "13.2"], ["North America", "17.2", "14.9", "15.8"], ["Asia-Pacific", "41.3", "38.7", "44.6"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many young people leave their home country to study or work abroad. What are the advantages and disadvantages of this trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-18",
      task1: {
        prompt: "The table below shows average weekly spending per household on selected items (£) in 2015 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Item", "2015 (\u00a3)", "2024 (\u00a3)"], rows: [["Food & drink", "58", "82"], ["Transport", "75", "94"], ["Housing & energy", "79", "138"], ["Leisure", "68", "71"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people think governments should ban smoking completely. Others believe people should have the right to choose. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-19",
      task1: {
        prompt: "The table below shows forest cover (% of land area) in four countries in 1990 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "1990", "2020"], rows: [["Brazil", "65.4", "59.4"], ["Indonesia", "65.4", "49.1"], ["Canada", "38.3", "38.7"], ["China", "16.7", "23.4"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many believe that social media does more harm than good. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-20",
      task1: {
        prompt: "The table below shows internet users per 100 people in five countries in 2005 and 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "2005", "2023"], rows: [["UK", "70", "96"], ["USA", "68", "92"], ["China", "9", "76"], ["India", "2", "52"], ["Nigeria", "4", "55"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some say famous people have a responsibility to be good role models. Others say they should be free to live as they wish. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-21",
      task1: {
        prompt: "The table below shows the number of overseas tourists (millions) visiting four countries in 2019 and 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "2019", "2023"], rows: [["France", "90", "100"], ["Spain", "83", "85"], ["UK", "41", "38"], ["Thailand", "40", "28"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many countries face an ageing population. What problems does this cause, and how can they be solved?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-22",
      task1: {
        prompt: "The table below shows average daily screen time (hours) by age group in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Age Group", "Hours/day"], rows: [["Under 18", "6.4"], ["18\u201334", "7.8"], ["35\u201354", "5.9"], ["55+", "4.1"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that scientific research should be funded mainly by governments rather than private companies. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-23",
      task1: {
        prompt: "The table below shows share of meals eaten at home, in restaurants, or as takeaways in 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Setting", "2010", "2024"], rows: [["At home", "72%", "61%"], ["Restaurant", "16%", "14%"], ["Takeaway/delivery", "12%", "25%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many parents believe their children should follow a strict routine. Others prefer to give them freedom. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-24",
      task1: {
        prompt: "The table below shows plastic waste generated per person (kg/year) in five countries in 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Plastic waste (kg/person)"], rows: [["USA", "130"], ["UK", "99"], ["Germany", "81"], ["Japan", "106"], ["India", "11"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Globalisation has changed the way we live and work. Are its effects more positive or more negative?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-25",
      task1: {
        prompt: "The table below shows women's participation in the workforce (%) in four countries in 1990 and 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "1990", "2022"], rows: [["Sweden", "79%", "83%"], ["UK", "65%", "72%"], ["Japan", "50%", "73%"], ["Saudi Arabia", "16%", "36%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some think advertising aimed at children should be banned. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-26",
      task1: {
        prompt: "The table below shows the percentage of school pupils achieving top grades in four subjects in 2014 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Subject", "2014", "2024"], rows: [["Maths", "18%", "27%"], ["English", "21%", "24%"], ["Science", "19%", "30%"], ["History", "16%", "18%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many people now choose to delay having children until later in life. What are the reasons for this trend, and what are the effects?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-27",
      task1: {
        prompt: "The table below shows annual rainfall (mm) in four cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["City", "Annual rainfall (mm)"], rows: [["London", "585"], ["Singapore", "2,340"], ["Cairo", "25"], ["Mumbai", "2,420"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that competitive sports teach children important life skills. Others say they create unhealthy pressure. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-28",
      task1: {
        prompt: "The table below shows the percentage of journeys made by bicycle in five European cities in 2010 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["City", "2010", "2024"], rows: [["Amsterdam", "32%", "41%"], ["Copenhagen", "26%", "36%"], ["Berlin", "13%", "22%"], ["Paris", "3%", "18%"], ["London", "2%", "8%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many believe that learning history is a waste of time in the modern world. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-29",
      task1: {
        prompt: "The table below shows the average price of a takeaway coffee (£) in five UK cities in 2020 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["City", "2020 (\u00a3)", "2025 (\u00a3)"], rows: [["London", "2.95", "4.20"], ["Edinburgh", "2.70", "3.90"], ["Manchester", "2.50", "3.70"], ["Cardiff", "2.40", "3.50"], ["Belfast", "2.30", "3.40"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some people think the best way to protect the environment is for individuals to change their behaviour. Others say only governments can make a difference. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-30",
      task1: {
        prompt: "The table below shows electricity generated from renewable sources (TWh) in 2010 and 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Source", "2010", "2023"], rows: [["Wind", "342", "2,304"], ["Solar", "32", "1,629"], ["Hydro", "3,520", "4,210"], ["Bioenergy", "312", "672"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many high-paying jobs require long working hours and little family time. Is this a fair trade-off?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-31",
      task1: {
        prompt: "The table below shows the number of books read per person per year in five countries in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Books/year"], rows: [["India", "11"], ["Thailand", "9"], ["China", "8"], ["UK", "5"], ["USA", "12"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that public libraries are no longer necessary in the digital age. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-32",
      task1: {
        prompt: "The table below shows public spending on health as a % of GDP in five countries in 2000 and 2022.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "2000", "2022"], rows: [["USA", "12.5%", "17.8%"], ["Germany", "9.8%", "12.7%"], ["UK", "6.0%", "11.3%"], ["Japan", "7.1%", "10.9%"], ["Mexico", "4.4%", "6.2%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many people prefer to live in cities, while others choose rural areas. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-33",
      task1: {
        prompt: "The table below shows the percentage of households with a pet in four countries in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "With a pet"], rows: [["USA", "68%"], ["UK", "52%"], ["Germany", "45%"], ["Japan", "28%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some believe that air travel should be heavily taxed to reduce emissions. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-34",
      task1: {
        prompt: "The table below shows annual coffee consumption (kg per person) in five countries in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Kg/person"], rows: [["Finland", "12.0"], ["Norway", "9.9"], ["Italy", "5.9"], ["UK", "2.8"], ["USA", "4.2"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many universities now offer fully online degrees. Are the benefits greater than the drawbacks?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-35",
      task1: {
        prompt: "The table below shows the number of marriages and divorces (per 1,000 people) in a country between 1980 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Year", "Marriages", "Divorces"], rows: [["1980", "7.4", "2.6"], ["2000", "5.1", "3.1"], ["2020", "3.8", "2.2"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some say space exploration is a waste of money. Others believe it benefits humanity. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-36",
      task1: {
        prompt: "The table below shows average house prices (£) in four UK regions in 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Region", "2015 (\u00a3)", "2025 (\u00a3)"], rows: [["London", "465,000", "640,000"], ["South East", "295,000", "420,000"], ["North West", "148,000", "240,000"], ["Scotland", "145,000", "210,000"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many countries are reducing arts funding to focus on science and technology. Is this a positive or negative development?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-37",
      task1: {
        prompt: "The table below shows the proportion of adults who exercise weekly in four age groups in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Age Group", "Exercise weekly"], rows: [["18\u201329", "68%"], ["30\u201344", "61%"], ["45\u201359", "52%"], ["60+", "44%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that giving children pocket money teaches financial responsibility. Others say it encourages materialism. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-38",
      task1: {
        prompt: "The table below shows the number of mobile phones sold (millions) by four manufacturers in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Manufacturer", "Units sold (m)"], rows: [["Apple", "232"], ["Samsung", "221"], ["Xiaomi", "146"], ["Other", "598"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "The rise of remote work has changed where people live. What are the effects on cities and rural areas?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-39",
      task1: {
        prompt: "The table below shows share of global tea production by country in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Share"], rows: [["China", "47%"], ["India", "21%"], ["Kenya", "8%"], ["Sri Lanka", "5%"], ["Other", "19%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some believe museums should be free for everyone. Others say visitors should pay to support them. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-40",
      task1: {
        prompt: "The table below shows the percentage of employees working from home in five industries in 2019 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Industry", "2019", "2024"], rows: [["Tech", "18%", "62%"], ["Finance", "12%", "49%"], ["Education", "6%", "21%"], ["Retail", "2%", "8%"], ["Healthcare", "4%", "11%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many people argue that homework should be banned in primary schools. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-41",
      task1: {
        prompt: "The table below shows average daily commute time (minutes) in five capital cities in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["City", "Commute (min)"], rows: [["Tokyo", "78"], ["London", "74"], ["New York", "69"], ["Paris", "68"], ["Sydney", "58"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "The rapid growth of artificial intelligence is changing the job market. Is this development more beneficial or harmful?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-42",
      task1: {
        prompt: "The table below shows the number of nights spent in hotels by domestic and international tourists (millions) in one country.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Year", "Domestic", "International"], rows: [["2018", "145", "98"], ["2020", "82", "18"], ["2022", "158", "74"], ["2024", "182", "112"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some say public spaces should prioritise pedestrians over cars. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-43",
      task1: {
        prompt: "The table below shows the share of online vs in-store retail sales (%) in 2015, 2020 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Channel", "2015", "2020", "2025"], rows: [["Online", "12%", "28%", "41%"], ["In-store", "88%", "72%", "59%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many believe that volunteering should be a required part of education. Discuss the advantages and disadvantages.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-44",
      task1: {
        prompt: "The table below shows average annual salary (£) in five UK professions in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Profession", "Average salary (\u00a3)"], rows: [["Doctor", "84,000"], ["Software engineer", "68,000"], ["Teacher", "42,000"], ["Nurse", "38,000"], ["Retail assistant", "23,000"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Some argue that strict laws are the best way to ensure good behaviour. Others believe education is more effective. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "acad-45",
      task1: {
        prompt: "The table below shows the proportion of plastic, paper, glass and metal recycled in three countries in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        table: { headers: ["Country", "Plastic", "Paper", "Glass", "Metal"], rows: [["Germany", "48%", "87%", "82%", "91%"], ["UK", "45%", "71%", "68%", "78%"], ["USA", "9%", "68%", "31%", "34%"]] },
        minWords: 150, minutesGuidance: 20,
      },
      task2: { prompt: "Many people now rely on online reviews when making decisions. Is this a positive or negative development?", minWords: 250, minutesGuidance: 40 },
    },
  ],
  general: [
    {
      id: "gen-1",
      task1: { prompt: "You recently bought a product online, but it arrived damaged.\n\nWrite a letter to the company. In your letter:\n\n- explain what you bought\n- describe the problem\n- say what you would like the company to do", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some people think children should be taught how to manage money at school. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-2",
      task1: { prompt: "You are planning to move to a new city for work. Write a letter to a friend who lives there.\n\nIn your letter:\n\n- explain why you are moving\n- ask for advice about finding accommodation\n- suggest meeting when you arrive", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now work from home instead of travelling to an office every day. Do the advantages of working from home outweigh the disadvantages?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-3",
      task1: { prompt: "You recently stayed at a hotel and were unhappy with the service.\n\nWrite a letter to the hotel manager. In your letter:\n\n- give details of your stay\n- explain what went wrong\n- say what action you would like them to take", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that families should eat meals together every day. Others say modern life makes this impossible. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-4",
      task1: { prompt: "A friend has invited you to visit them in another country, but you cannot go.\n\nWrite a letter to your friend. In your letter:\n\n- thank them for the invitation\n- explain why you cannot come\n- suggest another time you could meet", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many young people today choose to live with their parents longer than in the past. Is this a positive or negative trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-5",
      task1: { prompt: "You want to apply for a part-time job at a local café.\n\nWrite a letter to the manager. In your letter:\n\n- say which job you are applying for\n- describe your skills and experience\n- say when you are available to start", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some people think children should help with housework. Others believe they should focus only on studies. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-6",
      task1: { prompt: "Your neighbour has been making a lot of noise late at night.\n\nWrite a letter to your neighbour. In your letter:\n\n- explain the problem\n- say how it is affecting you\n- ask them to make changes", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many believe that learning to cook is an essential life skill. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-7",
      task1: { prompt: "You recently took a short course at a local college.\n\nWrite a letter to the course director. In your letter:\n\n- say which course you took\n- describe what you enjoyed\n- suggest improvements", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some people prefer to spend money on travel, while others save for the future. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-8",
      task1: { prompt: "You want to organise a surprise birthday party for a close friend.\n\nWrite a letter to another friend. In your letter:\n\n- explain your idea\n- ask for help with arrangements\n- suggest a date and place", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now buy second-hand items rather than new ones. Is this a positive or negative trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-9",
      task1: { prompt: "You have lost an item on public transport.\n\nWrite a letter to the transport company. In your letter:\n\n- describe what you lost\n- explain where and when you lost it\n- ask what you should do next", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that pets should be allowed in workplaces. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-10",
      task1: { prompt: "You recently visited a city for a holiday and want to recommend it.\n\nWrite a letter to a friend. In your letter:\n\n- describe the city\n- explain why you enjoyed it\n- suggest things they could do there", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people argue that small communities are better places to live than big cities. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-11",
      task1: { prompt: "Your local council is planning to close a public park near your home.\n\nWrite a letter to the council. In your letter:\n\n- explain how the park is used\n- describe the effect of closing it\n- suggest an alternative", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some say that grandparents should help raise grandchildren. Others believe parents should do this alone. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-12",
      task1: { prompt: "You want to take a few days off work for a personal matter.\n\nWrite a letter to your manager. In your letter:\n\n- explain why you need time off\n- say which dates you would like\n- offer to help with handover", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many think that elderly people should continue working as long as possible. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-13",
      task1: { prompt: "You recently ordered a meal from a restaurant for delivery, but there were problems.\n\nWrite a letter to the restaurant. In your letter:\n\n- describe what you ordered\n- explain the problems\n- say what you want them to do", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some people enjoy living alone, while others prefer sharing with family or friends. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-14",
      task1: { prompt: "A friend is thinking of moving to your city.\n\nWrite a letter to your friend. In your letter:\n\n- describe the area where you live\n- suggest places they could live\n- mention any disadvantages", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many believe that watching the news is important for everyone. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-15",
      task1: { prompt: "You attended a wedding recently and want to thank the couple.\n\nWrite a letter to them. In your letter:\n\n- thank them for the invitation\n- comment on the day\n- suggest a future meeting", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think it is better to buy locally produced food, even if it is more expensive. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-16",
      task1: { prompt: "You want to take an English course in another country.\n\nWrite a letter to a language school. In your letter:\n\n- explain your level of English\n- ask about courses and prices\n- ask about accommodation options", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now use mobile phones to make payments instead of cash. Is this a positive or negative development?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-17",
      task1: { prompt: "Your local gym is changing its opening hours, which does not suit you.\n\nWrite a letter to the manager. In your letter:\n\n- explain how you usually use the gym\n- describe the problem the new hours cause\n- suggest a change", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some say employees should be allowed to wear what they want to work. Others believe a dress code is necessary. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-18",
      task1: { prompt: "You have been offered a new job in another country.\n\nWrite a letter to your current manager. In your letter:\n\n- explain about the new job\n- thank them for their support\n- suggest how to hand over your duties", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many parents read to their children every night. Why is this important, and what are the effects?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-19",
      task1: { prompt: "You want to suggest a charity event at work.\n\nWrite a letter to your manager. In your letter:\n\n- explain your idea\n- say which charity it would support\n- ask for permission and help", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe young people should travel before starting their career. Others think they should focus on work straight away. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-20",
      task1: { prompt: "You stayed with a family while studying abroad.\n\nWrite a letter to thank them. In your letter:\n\n- thank them for their hospitality\n- describe something memorable\n- invite them to visit you", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now own more clothes than they need. What are the causes, and what can be done about it?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-21",
      task1: { prompt: "You recently bought an electronic device that is not working properly.\n\nWrite a letter to the shop where you bought it. In your letter:\n\n- describe the product\n- explain what is wrong\n- say what you would like them to do", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some say that physical exercise should be a daily requirement for everyone. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-22",
      task1: { prompt: "A friend is starting a new business.\n\nWrite a letter to your friend. In your letter:\n\n- congratulate them\n- offer some advice from your experience\n- offer practical help", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people prefer cooking at home rather than eating out. Discuss the advantages and disadvantages.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-23",
      task1: { prompt: "You missed an important class at college recently.\n\nWrite a letter to your tutor. In your letter:\n\n- explain why you were absent\n- ask what you missed\n- ask how you can catch up", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think governments should encourage people to have more children. Others believe smaller families are better. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-24",
      task1: { prompt: "You are planning a weekend trip with a friend.\n\nWrite a letter to your friend. In your letter:\n\n- suggest a destination\n- describe what you could do there\n- ask them to confirm dates", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people argue that everyone should learn basic first aid. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-25",
      task1: { prompt: "You want to complain about the bus service in your area.\n\nWrite a letter to the bus company. In your letter:\n\n- describe how you use the bus\n- explain the problems\n- suggest improvements", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that giving children mobile phones is helpful. Others think it causes problems. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-26",
      task1: { prompt: "You want to take a course online from a foreign university.\n\nWrite a letter to the admissions office. In your letter:\n\n- introduce yourself\n- explain why you want to take the course\n- ask about requirements and fees", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now follow influencers on social media. Is this a positive or negative trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-27",
      task1: { prompt: "A relative is visiting your country for the first time.\n\nWrite a letter to your relative. In your letter:\n\n- suggest the best time to visit\n- describe places they should see\n- offer to meet them at the airport", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think that learning to drive should be encouraged for all young adults. Others believe it is unnecessary. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-28",
      task1: { prompt: "You recently used a taxi service and want to praise the driver.\n\nWrite a letter to the taxi company. In your letter:\n\n- give details of the journey\n- explain what the driver did well\n- suggest how the company could recognise this", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now exercise at home rather than going to the gym. What are the advantages and disadvantages?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-29",
      task1: { prompt: "You want to rent a flat that you have seen advertised.\n\nWrite a letter to the landlord. In your letter:\n\n- introduce yourself\n- ask about the property\n- arrange a time to view it", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that everyone should learn to swim. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-30",
      task1: { prompt: "Your children's school is planning to reduce sports activities.\n\nWrite a letter to the head teacher. In your letter:\n\n- explain the benefits of sport\n- describe how your child uses these activities\n- suggest an alternative plan", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people enjoy gardening as a hobby. What are the benefits, both personal and social?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-31",
      task1: { prompt: "You recently joined a new club or society.\n\nWrite a letter to a friend. In your letter:\n\n- describe the club\n- explain why you joined\n- invite them to come with you", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think parents should choose the careers their children will follow. Others believe children should choose for themselves. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-32",
      task1: { prompt: "You bought a present for a friend from an online shop, but it has not arrived.\n\nWrite a letter to the company. In your letter:\n\n- give details of your order\n- explain why you need it quickly\n- ask what they will do", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people argue that buying expensive brands is a waste of money. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-33",
      task1: { prompt: "You are organising a small farewell party for a colleague.\n\nWrite a letter to other colleagues. In your letter:\n\n- explain the reason for the party\n- give details of the date and place\n- ask for help with arrangements", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that having a routine each day is important. Others prefer flexibility. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-34",
      task1: { prompt: "A friend has asked your advice about quitting their job to travel.\n\nWrite a letter to your friend. In your letter:\n\n- give your opinion on the idea\n- describe possible benefits\n- mention some risks", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now adopt pets from shelters rather than buying them. Is this a positive trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-35",
      task1: { prompt: "You want to suggest improvements to the canteen at your workplace.\n\nWrite a letter to your manager. In your letter:\n\n- explain how you use the canteen\n- describe what could be improved\n- suggest specific changes", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some say teenagers should have a part-time job while at school. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-36",
      task1: { prompt: "You have decided to start a new hobby.\n\nWrite a letter to a friend. In your letter:\n\n- describe the hobby\n- explain why you chose it\n- invite them to try it with you", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now spend their holidays in their own country. What are the advantages and disadvantages of this?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-37",
      task1: { prompt: "Your flight was cancelled and you had to make alternative arrangements.\n\nWrite a letter to the airline. In your letter:\n\n- give details of your booking\n- describe what happened\n- ask for compensation", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think it is important to know your neighbours. Others say privacy is more important. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-38",
      task1: { prompt: "You are unable to attend a friend's wedding.\n\nWrite a letter to your friend. In your letter:\n\n- congratulate them\n- explain why you cannot attend\n- suggest how you can celebrate together later", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now use bicycles instead of cars for short journeys. Is this a positive development?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-39",
      task1: { prompt: "Your local library is asking for ideas for new services.\n\nWrite a letter to the head librarian. In your letter:\n\n- explain how you use the library\n- suggest a new service\n- describe how it would help the community", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that having a strict morning routine improves your day. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-40",
      task1: { prompt: "You want to recommend a book to a friend.\n\nWrite a letter to your friend. In your letter:\n\n- describe the book\n- explain why you liked it\n- suggest where they can get it", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now follow recipes from videos online. What are the advantages and disadvantages?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-41",
      task1: { prompt: "You missed an important meeting at work.\n\nWrite a letter to your colleague. In your letter:\n\n- explain why you missed it\n- ask for a summary of what was decided\n- offer to help with any follow-up", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some say children should learn to play a musical instrument. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-42",
      task1: { prompt: "You recently had problems with a delivery to your home.\n\nWrite a letter to the delivery company. In your letter:\n\n- give details of the delivery\n- explain what went wrong\n- say what you want them to do", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people now keep in touch with friends online rather than meeting in person. Is this a positive or negative trend?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-43",
      task1: { prompt: "A friend in another country has invited you to their graduation.\n\nWrite a letter to your friend. In your letter:\n\n- congratulate them\n- say whether you can attend\n- suggest a gift idea", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some believe that helping at a local charity is the best way to spend free time. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-44",
      task1: { prompt: "You are interested in volunteering with a local charity.\n\nWrite a letter to the charity. In your letter:\n\n- introduce yourself\n- explain why you want to volunteer\n- ask what kind of help they need", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Many people prefer to take holidays in the countryside rather than in cities. Discuss both views and give your opinion.", minWords: 250, minutesGuidance: 40 },
    },
    {
      id: "gen-45",
      task1: { prompt: "Your child's school is planning a school trip abroad.\n\nWrite a letter to the head teacher. In your letter:\n\n- say whether you support the trip\n- ask about cost and safety\n- suggest what else parents should know", minWords: 150, minutesGuidance: 20 },
      task2: { prompt: "Some think that schools should teach children how to look after their mental health. To what extent do you agree or disagree?", minWords: 250, minutesGuidance: 40 },
    },
  ],
};

export function pickRandomSet(variant: WritingVariant): WritingQuestionSet {
  const sets = IELTS_WRITING_PROMPTS[variant];
  return sets[Math.floor(Math.random() * sets.length)];
}
