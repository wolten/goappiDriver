import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(d: any): string {
    const currentDate = new Date(new Date().toUTCString());
    const date = new Date(d + 'Z');

    const year = currentDate.getFullYear() - date.getFullYear();
    const month = currentDate.getMonth() - date.getMonth();
    const day = currentDate.getDate() - date.getDate();
    const hour = currentDate.getHours() - date.getHours();
    const minute = currentDate.getMinutes() - date.getMinutes();
    const second = currentDate.getSeconds() - date.getSeconds();

    const createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

    if (createdSecond >= 31556926) {
      const yearAgo = Math.floor(createdSecond / 31556926);
      return yearAgo > 1 ? yearAgo + ' years ago' : yearAgo + ' year ago';
    
    } else if (createdSecond >= 2629746) {
      const monthAgo = Math.floor(createdSecond / 2629746);
      return monthAgo > 1 ? monthAgo + ' months ago' : monthAgo + ' month ago';
    
    } else if (createdSecond >= 86400) {
      const dayAgo = Math.floor(createdSecond / 86400);
      return dayAgo > 1 ? dayAgo + ' days ago' : dayAgo + ' day ago';
    
    } else if (createdSecond >= 3600) {
      const hourAgo = Math.floor(createdSecond / 3600);
      return hourAgo > 1 ? hourAgo + ' hours ago' : hourAgo + ' hour ago';
    
    } else if (createdSecond >= 60) {
      const minuteAgo = Math.floor(createdSecond / 60);
      return minuteAgo > 1 ? minuteAgo + ' minutes ago' : minuteAgo + ' minute ago';
    
    } else if (createdSecond < 60) {
      return createdSecond > 1 ? createdSecond + ' seconds ago' : createdSecond + ' second ago';
    
    } else if (createdSecond < 0) {
      return '0 second ago';
    }
  
  }

}
