import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface NewsType {
  _id: string
  title: string;
  description: string;
  date: string;
  link: string
}

interface NewsState {
    news:NewsType[];
    loading:boolean;
    deletingId: string | null;
    error:null | string;
}

const initialState:NewsState={
    news:[],
    loading:true,
    deletingId:null,
    error:null
}

export const fetchNews = createAsyncThunk<NewsType[],void,{rejectValue:string}>("/news/fetch", async (_,thunkAPI)=>{
    try{
    const res = await axios.get("/api/news")
    return res.data as NewsType[]
    }
    catch(err){
        let message = "Failed to fetch News"
        if(err instanceof Error){message=err.message}
        if(axios.isAxiosError(err)){message=err.response?.data?.error || "Request failed"}
        return thunkAPI.rejectWithValue(message)
    }
})

export const removeNews = createAsyncThunk<string,string,{rejectValue:string}>("/news/delete",async (id,thunkAPI)=>{
    try{
        await axios.delete(`/api/admin/news/${id}`)
        return id
    }
    catch(err){
        let message = "Failed to remove News"
        if(err instanceof Error){message=err.message}
        if(axios.isAxiosError(err)){message=err.response?.data?.error|| "Request failed"} 
        return thunkAPI.rejectWithValue(message)
    }
})

export const NewsSlice = createSlice({
    name:"news",
    initialState,
    reducers:{
        clearError:(state)=>{
            state.error=null
        },
        removeNewsLocal:(state,action: PayloadAction<string>)=>{
           state.news = state.news.filter((n)=>n._id!==action.payload)
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchNews.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(fetchNews.fulfilled,(state,action:PayloadAction<NewsType[]>)=>{
            state.loading=false
            state.news=action.payload
        })
        .addCase(fetchNews.rejected,(state,action)=>{
            state.loading=false
            state.error= typeof action.payload==="string"? action.payload :action.error.message || "Failed to fetch news"
        })

        // remove news
        .addCase(removeNews.pending,(state,action)=>{
            state.deletingId=action.meta.arg
            state.error=null
        })
        .addCase(removeNews.fulfilled,(state,action)=>{
           state.news = state.news.filter((n)=>n._id!==action.payload)
           state.deletingId=null
        })
        .addCase(removeNews.rejected,(state,action)=>{
            state.error=typeof action.payload==="string"?action.payload:action.error.message || "Failed to remove News"
            state.deletingId=null
        })
    }
})

export default NewsSlice.reducer
export const {removeNewsLocal,clearError} = NewsSlice.actions