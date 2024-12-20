import React, { useState, useEffect, useRef } from 'react'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

