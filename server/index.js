import axios from "axios";
import * as cheerio from 'cheerio'


const webby = (await axios.get("https://docs.stripe.com/billing/customer/tax-ids"))["data"]
const $ = cheerio.load(webby)

